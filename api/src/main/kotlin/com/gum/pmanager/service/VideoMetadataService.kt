package com.gum.pmanager.service

import com.gum.pmanager.controller.VideoNotFoundException
import com.gum.pmanager.data.model.toVideoMetadataEntity
import com.gum.pmanager.data.model.toVideoMetadataResponse
import com.gum.pmanager.data.repository.VideoMetadataRepository
import com.gum.pmanager.model.CreateVideoResponse
import com.gum.pmanager.model.VideoResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

interface VideoMetadataService {
    fun create(request: VideoResponse): CreateVideoResponse
    fun update(request: VideoResponse): CreateVideoResponse
    fun delete(id: Long)
    fun get(id: Long): VideoResponse
    fun search(query: String, pageable: Pageable): List<VideoResponse>
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

    override fun update(request: VideoResponse): CreateVideoResponse {
        TODO("Not yet implemented")
    }

    override fun delete(id: Long) {
        LOG.info("Deleting video: {}", id)
        videoMetadataRepository.deleteById(id)
    }

    override fun get(id: Long): VideoResponse {
        return videoMetadataRepository.findById(id)
            .orElseThrow { VideoNotFoundException("Not found") }.toVideoMetadataResponse()
    }

    override fun search(query: String, pageable: Pageable): List<VideoResponse> {
        TODO("Not yet implemented")
    }
}

val LOG: Logger = LoggerFactory.getLogger(VideoMetadataServiceImpl::class.java)
