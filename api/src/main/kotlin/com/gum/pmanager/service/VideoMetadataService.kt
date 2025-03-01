package com.gum.pmanager.service

import com.gum.pmanager.controller.VideoNotFoundException
import com.gum.pmanager.data.model.SearchFilters
import com.gum.pmanager.data.model.VideoMetadataEntity
import com.gum.pmanager.data.model.copyToVideoMetadataEntity
import com.gum.pmanager.data.model.toVideoMetadataResponse
import com.gum.pmanager.data.repository.VideoMetadataRepository
import com.gum.pmanager.indexer.PManagerIndexer
import com.gum.pmanager.model.CreateVideoResponse
import com.gum.pmanager.model.VideoResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.io.PathResource
import org.springframework.core.io.Resource
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.StringUtils
import org.springframework.web.util.UriUtils
import java.io.BufferedReader
import java.io.File
import java.lang.IllegalArgumentException
import java.net.URI
import java.nio.charset.Charset
import java.time.Duration
import java.time.Instant

interface VideoMetadataService {
    fun create(request: VideoResponse): CreateVideoResponse
    fun update(id: Long?, request: VideoResponse): CreateVideoResponse
    fun delete(id: Long, permanent: Boolean = false)
    fun deleteAll(permanent: Boolean = false, videoIds: List<String> = listOf(), directory: String = "")
    fun get(id: Long): VideoResponse
    fun view(id: Long): VideoResponse
    fun search(query: String, pageable: Pageable): List<VideoResponse>
    fun pagedSearch(query: String, pageable: Pageable, searchFilters: SearchFilters = SearchFilters(listOf(), listOf(), listOf(), listOf(), Duration.ZERO, Duration.ofMillis(Int.MAX_VALUE.toLong()))): Page<VideoResponse>
    fun allCategories(query: String): Map<String, Long>
    fun allTags(query: String): Map<String, Long>
    fun allSources(query: String): Map<String, Long>
    fun related(id: Long, pageable: Pageable = PageRequest.of(0, 16)): List<VideoResponse>
    fun download(id: Long): Resource
    fun index(directory: String, dryrun: Boolean)
}

@Service
class VideoMetadataServiceImpl(
    private val videoMetadataRepository: VideoMetadataRepository,
    private val indexer: PManagerIndexer
) : VideoMetadataService {
    @Transactional
    override fun create(request: VideoResponse): CreateVideoResponse {
        val existing = videoMetadataRepository.findByUri(request.uri ?: "")

        if (existing == null) {
            val entity = videoMetadataRepository.save(request.copyToVideoMetadataEntity())
            return CreateVideoResponse(entity.id)
        }

        update(existing.id, request)
        return CreateVideoResponse(existing.id)
    }

    @Transactional
    override fun update(id: Long?, request: VideoResponse): CreateVideoResponse {
        requireNotNull(id)
        val existing = videoMetadataRepository.findById(id).orElseThrow { VideoNotFoundException("Not found") }
        val update = updateEntity(existing, request)
        return CreateVideoResponse(update.id)
    }

    @Transactional
    override fun delete(id: Long, permanent: Boolean) {
        LOG.info("Deleting video: {}", id)
        val existing = videoMetadataRepository.findById(id).orElseThrow { VideoNotFoundException("Not found") }
        val results = mutableListOf<Boolean>()
        results.add(File(URI.create(existing.thumbUri)).delete())
        results.add(File(URI.create(existing.previewUri)).delete())

        if (permanent) {
            results.add(File(URI.create(existing.uri)).delete())
        }

        if (results.reduce { acc, b -> acc && b }) {
            LOG.info("Deleted video files: {}, {}, {}", existing.uri, existing.thumbUri, existing.previewUri)
        } else {
            LOG.warn("Video file deletion failed: {}, {}, {}", existing.uri, existing.thumbUri, existing.previewUri)
            LOG.warn("results: {}", results)
            //throw RuntimeException("Video file deletion failed!")
        }

        videoMetadataRepository.deleteById(id)
    }

    @Transactional
    override fun deleteAll(permanent: Boolean, videoIds: List<String>, directory: String) {
        videoIds.forEach {
            delete(it.toLong(), permanent)
        }
    }

    @Transactional(readOnly = true)
    override fun get(id: Long): VideoResponse {
        return videoMetadataRepository.findById(id)
            .orElseThrow { VideoNotFoundException("Not found") }.toVideoMetadataResponse()
    }

    @Transactional
    override fun view(id: Long): VideoResponse {
        val existing = videoMetadataRepository.findById(id)
            .orElseThrow { VideoNotFoundException("Not found") }
        existing.views += 1;
        existing.lastAccessed = Instant.now()
        videoMetadataRepository.save(existing)
        return existing.toVideoMetadataResponse()
    }

    @Transactional(readOnly = true)
    override fun search(query: String, pageable: Pageable): List<VideoResponse> {
        return pagedSearch(query, pageable = pageable).toList()
    }

    @Transactional(readOnly = true)
    override fun pagedSearch(query: String, pageable: Pageable, searchFilters: SearchFilters): Page<VideoResponse> {
        return videoMetadataRepository.pagedSearch(query, pageable, searchFilters).map { it.toVideoMetadataResponse() }
    }

    @Transactional(readOnly = true)
    override fun allTags(query: String): Map<String, Long> {
        return videoMetadataRepository.allTags(query)
    }

    @Transactional(readOnly = true)
    override fun allSources(query: String): Map<String, Long> {
        return videoMetadataRepository.allSources(query)
    }

    @Transactional(readOnly = true)
    override fun allCategories(query: String): Map<String, Long> {
        return videoMetadataRepository.allCategories(query)
    }

    @Transactional(readOnly = true)
    override fun related(id: Long, pageable: Pageable): List<VideoResponse> {
        val existing = videoMetadataRepository.findById(id)
            .orElseThrow { VideoNotFoundException("Not found") }
        return videoMetadataRepository.recommended(existing, pageable).map { it.toVideoMetadataResponse() }
    }

    override fun download(id: Long): Resource {
        val videoDetails = videoMetadataRepository.findById(id)
            .orElseThrow { VideoNotFoundException("Not found") }

        return PathResource(URI.create(videoDetails.uri))
    }

    private fun updateEntity(update: VideoMetadataEntity, request: VideoResponse): VideoMetadataEntity {
        request.copyToVideoMetadataEntity(update)
        return videoMetadataRepository.save(update)
    }

    override fun index(directory: String, dryrun: Boolean) {
        if (!StringUtils.hasText(directory)) {
            throw IllegalArgumentException("Directory must not be empty.")
        }

        val fileUri = URI.create(UriUtils.encodePath(directory, Charset.forName("UTF-8")))
        if (fileUri.path == "/") {
            throw IllegalArgumentException("Directory must not be root.")
        }

        val pb = ProcessBuilder()
        val indexDir = File(fileUri)
        val wslDir = convertToWsl(directory)

        if (!dryrun && !indexDir.exists()) {
            LOG.warn("Directory does not exist.")
            throw IllegalArgumentException("Directory does not exist.")
        }

        pb.directory(File(System.getProperty("user.dir")))
        pb.redirectErrorStream(true)
        pb.redirectInput(ProcessBuilder.Redirect.PIPE)

        pb.command("bash", "-c", "\"./scripts/prep.sh '${wslDir}'\"")

        LOG.info("Running prep for {}", wslDir)
        if (!dryrun) {
            val p = pb.start()
            do {
                Thread.sleep(1000)
            } while (!p.pollForDone())
            p.destroy()
        }

        LOG.info("Finished prep for {}", wslDir)

        LOG.info("Running index for {}", indexDir.toURI())
        if (!dryrun) {
            indexer.index(indexDir.toURI().toString())
        }
        LOG.info("Finished index for {}", indexDir.toURI())
    }
}

val LOG: Logger = LoggerFactory.getLogger(VideoMetadataServiceImpl::class.java)

private fun Process.pollForDone(): Boolean {
    val outputText = inputStream.bufferedReader().use(BufferedReader::readText)
    return outputText.contains("Finished prep.sh")
}

private fun Process.processOutput(): String {
    return inputStream.bufferedReader().use(BufferedReader::readText)
}

private fun convertToWsl(indexDir: String): String {
    val regex = """^file:///([A-Za-z]):(.*)""".toRegex()
    return regex.replace(indexDir, "/mnt/\$1\$2").lowercase()
}
