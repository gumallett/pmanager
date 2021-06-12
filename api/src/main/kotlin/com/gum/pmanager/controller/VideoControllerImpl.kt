package com.gum.pmanager.controller

import com.gum.pmanager.api.VideosApi
import com.gum.pmanager.model.CreateVideoResponse
import com.gum.pmanager.model.VideoResponse
import com.gum.pmanager.service.VideoMetadataService
import org.springframework.core.io.Resource
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController

@RestController
class VideoControllerImpl(
    private val videoService: VideoMetadataService
): VideosApi {

    override fun getVideo(id: Long): ResponseEntity<VideoResponse> {
        return ResponseEntity.ok(videoService.get(id))
    }

    override fun addVideo(videoResponse: VideoResponse?): ResponseEntity<CreateVideoResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoService.create(videoResponse!!))
    }

    override fun searchVideos(q: String?, page: Int, size: Int): ResponseEntity<List<VideoResponse>> {
        return ResponseEntity.ok(videoService.search(q ?: "", PageRequest.of(page, size)))
    }

    override fun updateVideo(id: Long, videoResponse: VideoResponse?): ResponseEntity<Unit> {
        videoService.update(id, videoResponse!!)
        return ResponseEntity.status(HttpStatus.OK).build()
    }

    override fun deleteVideo(id: Long): ResponseEntity<Unit> {
        return ResponseEntity.ok(videoService.delete(id))
    }

    override fun downloadVideo(id: Long, download: Boolean): ResponseEntity<Resource> {
        val headers = HttpHeaders()
        val resource = videoService.download(id)
        if (download) {
            headers.set("Content-Disposition", "attachment; filename=\"${resource.filename}\"")
        }

        return ResponseEntity.status(HttpStatus.OK).headers(headers).body(resource)
    }
}
