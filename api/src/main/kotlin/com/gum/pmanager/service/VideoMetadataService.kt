package com.gum.pmanager.service

import com.gum.pmanager.controller.VideoNotFoundException
import com.gum.pmanager.data.model.toCategoryEntity
import com.gum.pmanager.data.model.toTagEntity
import com.gum.pmanager.data.model.toVideoMetadataEntity
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

interface VideoMetadataService {
    fun create(request: VideoResponse): CreateVideoResponse
    fun update(id: Long?, request: VideoResponse): CreateVideoResponse
    fun delete(id: Long)
    fun get(id: Long): VideoResponse
    fun search(query: String, pageable: Pageable): List<VideoResponse>
    fun pagedSearch(query: String, pageable: Pageable): Page<VideoResponse>
    fun download(id: Long): Resource
}

@Service
class VideoMetadataServiceImpl(
    private val videoMetadataRepository: VideoMetadataRepository
) : VideoMetadataService {
    @Transactional
    override fun create(request: VideoResponse): CreateVideoResponse {
        val entity = videoMetadataRepository.save(request.toVideoMetadataEntity())
        return CreateVideoResponse(entity.id)
    }

    @Transactional
    override fun update(id: Long?, request: VideoResponse): CreateVideoResponse {
        requireNotNull(id)
        val update = videoMetadataRepository.findById(id).orElseThrow { VideoNotFoundException("Not found") }

        when {
            request.description != null -> {
                update.description = request.description
            }
            request.title != null -> {
                update.title = request.title
            }
            request.uri != null -> {
                update.uri = request.uri
            }
            request.notes != null -> {
                update.notes = request.notes
            }
            request.source != null -> {
                update.source = request.source
            }
            request.views != null -> {
                update.views = request.views
            }
            request.rating != null -> {
                update.rating = request.rating.toShort()
            }
            request.lastAccessed != null -> {
                update.lastAccessed = request.lastAccessed.toInstant()
            }
            request.lastModified != null -> {
                update.lastModified = request.lastModified.toInstant()
            }
            request.videoFileInfo != null -> {
                when {
                    request.videoFileInfo.filename != null -> {
                        update.videoFileInfo.filename = request.videoFileInfo.filename
                    }
                    request.videoFileInfo.contentType != null -> {
                        update.videoFileInfo.contentType = request.videoFileInfo.contentType
                    }
                    request.videoFileInfo.createDate != null -> {
                        update.videoFileInfo.createDate = request.videoFileInfo.createDate.toInstant()
                    }
                    request.videoFileInfo.length != null -> {
                        update.videoFileInfo.length = Duration.ofMillis(request.videoFileInfo.length)
                    }
                    request.videoFileInfo.size != null -> {
                        update.videoFileInfo.size = request.videoFileInfo.size
                    }
                }
            }
            request.categories != null -> {
                update.categories = request.categories.map { it.toCategoryEntity() }.toMutableList()
            }
            request.tags != null -> {
                update.tags = request.tags.map { it.toTagEntity() }.toMutableList()
            }
        }

        videoMetadataRepository.save(update)
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

    @Transactional(readOnly = true)
    override fun search(query: String, pageable: Pageable): List<VideoResponse> {
        return pagedSearch(query, pageable).toList()
    }

    @Transactional(readOnly = true)
    override fun pagedSearch(query: String, pageable: Pageable): Page<VideoResponse> {
        return videoMetadataRepository.pagedSearch(query, pageable).map { it.toVideoMetadataResponse() }
    }

    override fun download(id: Long): Resource {
        val videoDetails = videoMetadataRepository.findById(id)
            .orElseThrow { VideoNotFoundException("Not found") }

        return PathResource(URI.create(videoDetails.uri))
    }
}

val LOG: Logger = LoggerFactory.getLogger(VideoMetadataServiceImpl::class.java)
