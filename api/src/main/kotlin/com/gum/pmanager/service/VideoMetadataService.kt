package com.gum.pmanager.service

import com.gum.pmanager.controller.VideoNotFoundException
import com.gum.pmanager.data.model.SearchFilters
import com.gum.pmanager.data.model.VideoMetadataEntity
import com.gum.pmanager.data.model.copyToVideoMetadataEntity
import com.gum.pmanager.data.model.toVideoMetadataResponse
import com.gum.pmanager.data.repository.VideoMetadataRepository
import com.gum.pmanager.model.CreateVideoResponse
import com.gum.pmanager.model.VideoResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.io.PathResource
import org.springframework.core.io.Resource
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.net.URI
import java.time.Duration
import java.time.Instant

interface VideoMetadataService {
    fun create(request: VideoResponse): CreateVideoResponse
    fun update(id: Long?, request: VideoResponse): CreateVideoResponse
    fun delete(id: Long)
    fun get(id: Long): VideoResponse
    fun view(id: Long): VideoResponse
    fun search(query: String, pageable: Pageable): List<VideoResponse>
    fun pagedSearch(query: String, pageable: Pageable, searchFilters: SearchFilters = SearchFilters(listOf(), listOf(), listOf(), listOf(), Duration.ZERO, Duration.ofMillis(Int.MAX_VALUE.toLong()))): Page<VideoResponse>
    fun allCategories(query: String): Map<String, Long>
    fun allTags(query: String): Map<String, Long>
    fun allSources(query: String): Map<String, Long>
    fun download(id: Long): Resource
}

@Service
class VideoMetadataServiceImpl(
    private val videoMetadataRepository: VideoMetadataRepository
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
    override fun delete(id: Long) {
        LOG.info("Deleting video: {}", id)
        videoMetadataRepository.deleteById(id)
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
        videoMetadataRepository.setViewed(id, Instant.now())
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

    override fun download(id: Long): Resource {
        val videoDetails = videoMetadataRepository.findById(id)
            .orElseThrow { VideoNotFoundException("Not found") }

        return PathResource(URI.create(videoDetails.uri))
    }

    private fun updateEntity(update: VideoMetadataEntity, request: VideoResponse): VideoMetadataEntity {
        request.copyToVideoMetadataEntity(update)
        return videoMetadataRepository.save(update)
    }
}

val LOG: Logger = LoggerFactory.getLogger(VideoMetadataServiceImpl::class.java)
