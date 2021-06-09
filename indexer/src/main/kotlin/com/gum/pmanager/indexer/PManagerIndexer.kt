package com.gum.pmanager.indexer

import com.drew.metadata.Tag
import com.gum.pmanager.config.IndexingProperties
import org.openapitools.client.apis.VideosApi
import org.openapitools.client.infrastructure.ClientException
import org.openapitools.client.infrastructure.ServerException
import org.openapitools.client.models.VideoFileInfoResponse
import org.openapitools.client.models.VideoResponse
import org.slf4j.LoggerFactory
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service
import java.io.File
import java.net.URI
import java.nio.file.Files
import java.nio.file.Path
import java.time.Instant
import java.time.ZoneOffset

@Service
class PManagerIndexer(val api: VideosApi, val metadataService: VideoMetadataService, val indexingProperties: IndexingProperties) {
    private val LOG = LoggerFactory.getLogger(PManagerIndexer::class.java)

    fun index() {
        indexingProperties.paths.forEach { index(it)}
    }

    fun index(path: String) {
        val dir = File(URI.create(path))
        LOG.info("Reading file metadata in directory {} {}", dir, path)
        Files.list(dir.toPath()).forEach { indexDirectoryContents(it) }
    }

    fun indexDirectoryContents(path: Path) {
        LOG.info("Reading file metadata for {}", path)
        val file = path.toFile()

        if (file.isDirectory) {
            return index(path.toUri().toString())
        }

        val metadata = try {
            metadataService.getMetadata(file)
        } catch (e: Exception) {
            LOG.warn("Could not fetch video metadata for {}", path)
            null
        }

        val duration = metadata?.findTag("Duration")?.description?.toLongOrNull()
        val timescale = metadata?.findTag("Media Time Scale")?.description?.toLongOrNull()
        val width = metadata?.findTag("Width")?.description
            ?.replace("pixels", "")?.trim()?.toLongOrNull()
        val height = metadata?.findTag("Height")?.description
            ?.replace("pixels", "")?.trim()?.toLongOrNull()

        val titleCorrectionRegex = "[_]".toRegex()
        val contentType = when (file.extension) {
            "mp4", "m4v" -> "video/mp4"
            "avi" -> "video/x-msvideo"
            "flv", "f4v" -> "video/x-flv"
            "mpg", "mpeg" -> "video/mpeg"
            "mov" -> "video/quicktime"
            "asf", "wmv" -> "video/x-ms-asf"
            "webm" -> "video/webm"
            else -> "video/other"
        }

        if (contentType == "video/other") {
            LOG.info("Skipping unknown video type for {}", path)
            return
        }

        val request = VideoResponse(
            title = file.nameWithoutExtension.replace(titleCorrectionRegex, "-"),
            description = file.nameWithoutExtension.replace(titleCorrectionRegex, "-"),
            uri = path.toUri().toString(),
            source = file.name,
            videoFileInfo = VideoFileInfoResponse(
                filename = file.name,
                contentType = contentType,
                size = file.length(),
                length = getDurationInMillis(duration, timescale),
                width = width,
                height = height,
                createDate = Instant.ofEpochMilli(file.lastModified()).atOffset(ZoneOffset.UTC)
            )
        )
        LOG.info("Sending request {}", request)
        try {
            api.addVideo(request)
        } catch (e: ServerException) {
            LOG.warn("Failed indexing {}", path)
            LOG.warn("Indexing failed", e)
        } catch (e: ClientException) {
            LOG.warn("Failed indexing {}", path)
            LOG.warn("Indexing failed", e)
        }
    }

    @EventListener(ContextRefreshedEvent::class)
    fun onApplicationStart() {
        index()
    }
}

fun getDurationInMillis(duration: Long?, timescale: Long?): Long {
    val milliVal = if (duration != null && timescale != null) {
        duration.toDouble() / timescale.toDouble() * 1000
    } else {
        null
    }
    return milliVal?.toLong() ?: 0L
}

fun printMetadata(allTags: Collection<Tag>?) {
    allTags?.forEach { tag ->
        println("description: ${tag.description}")
        println("directory name: ${tag.directoryName}")
        println("tag name: ${tag.tagName}")
        println("tag type: ${tag.tagType}")
    }
}
