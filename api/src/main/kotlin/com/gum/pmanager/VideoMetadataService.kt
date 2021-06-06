package com.gum.pmanager

import com.gum.pmanager.data.repository.VideoMetadataRepository
import com.gum.pmanager.model.CreateVideoResponse
import com.gum.pmanager.model.VideoResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

interface VideoMetadataService {
    fun create(request: VideoResponse): CreateVideoResponse
    fun update(request: VideoResponse): CreateVideoResponse
    fun delete(id: Long)
    fun get(id: Long): CreateVideoResponse
}

@Service
class VideoMetadataServiceImpl(
    private val videoMetadataRepository: VideoMetadataRepository
) : VideoMetadataService {
    override fun create(request: VideoResponse): CreateVideoResponse {
        TODO("Not yet implemented")
    }

    override fun update(request: VideoResponse): CreateVideoResponse {
        TODO("Not yet implemented")
    }

    override fun delete(id: Long) {
        LOG.info("Deleting video: {}", id)
        videoMetadataRepository.deleteById(id)
    }

    override fun get(id: Long): CreateVideoResponse {
        TODO("Not yet implemented")
    }

}

val LOG: Logger = LoggerFactory.getLogger(VideoMetadataServiceImpl::class.java)
