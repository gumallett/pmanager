package com.gum.pmanager.service

import com.gum.pmanager.controller.VideoNotFoundException
import com.gum.pmanager.data.model.*
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
import java.time.OffsetDateTime

interface VideoMetadataService {
    fun create(request: VideoResponse): CreateVideoResponse
    fun update(id: Long?, request: VideoResponse): CreateVideoResponse
    fun delete(id: Long)
    fun get(id: Long): VideoResponse
    fun view(id: Long): VideoResponse
    fun search(query: String, pageable: Pageable): List<VideoResponse>
    fun pagedSearch(query: String, tags: List<String> = listOf(), excludeTags: List<String> = listOf(), pageable: Pageable): Page<VideoResponse>
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
            val entity = videoMetadataRepository.save(request.toVideoMetadataEntity())
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
    override fun pagedSearch(query: String, tags: List<String>, excludeTags: List<String>, pageable: Pageable): Page<VideoResponse> {
        return videoMetadataRepository.pagedSearch(query, tags, excludeTags, pageable).map { it.toVideoMetadataResponse() }
    }

    override fun download(id: Long): Resource {
        val videoDetails = videoMetadataRepository.findById(id)
            .orElseThrow { VideoNotFoundException("Not found") }

        return PathResource(URI.create(videoDetails.uri))
    }

    private fun updateEntity(update: VideoMetadataEntity, request: VideoResponse): VideoMetadataEntity {
        if (request.description != null) {
            update.description = request.description
        }

        if (request.title != null) {
            update.title = request.title
        }

        if (request.uri != null) {
            update.uri = request.uri
        }

        if (request.notes != null) {
            update.notes = request.notes
        }

        if (request.source != null) {
            update.source = request.source
        }

        if (request.views != null) {
            update.views = request.views
        }

        if (request.rating != null) {
            update.rating = request.rating.toShort()
        }

        if (request.lastAccessed != null) {
            update.lastAccessed = request.lastAccessed.toInstant()
        }

        if (request.lastModified != null) {
            update.lastModified = request.lastModified.toInstant()
        }

        if (request.categories != null) {
            update.categories = request.categories.map { it.toCategoryEntity() }.toMutableList()
        }

        if (request.tags != null) {
            update.tags = request.tags.map { it.toTagEntity() }.toMutableList()
        }

        if (request.videoFileInfo?.filename != null) {
            update.videoFileInfo.filename = request.videoFileInfo.filename
        }

        if (request.videoFileInfo?.contentType != null) {
            update.videoFileInfo.contentType = request.videoFileInfo.contentType
        }

        if (request.videoFileInfo?.size != null) {
            update.videoFileInfo.size = request.videoFileInfo.size
        }

        if (request.videoFileInfo?.createDate != null) {
            update.videoFileInfo.createDate = request.videoFileInfo.createDate.toInstant()
        }

        if (request.videoFileInfo?.length != null) {
            update.videoFileInfo.length = Duration.ofMillis(request.videoFileInfo.length)
        }

        return videoMetadataRepository.save(update)
    }
}

val LOG: Logger = LoggerFactory.getLogger(VideoMetadataServiceImpl::class.java)
