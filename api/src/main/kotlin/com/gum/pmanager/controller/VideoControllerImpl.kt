package com.gum.pmanager.controller

import com.gum.pmanager.api.VideosApi
import com.gum.pmanager.model.*
import com.gum.pmanager.service.ResourceService
import com.gum.pmanager.service.VideoMetadataService
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.FileSystemResourceLoader
import org.springframework.core.io.Resource
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.time.OffsetDateTime

@RestController
class VideoControllerImpl(
    private val videoService: VideoMetadataService,
    private val resourceService: ResourceService
): VideosApi {

    override fun getVideo(id: Long): ResponseEntity<VideoApiResponse> {
        return ResponseEntity.ok(
            VideoApiResponse(
            data = videoService.get(id)
        ))
    }

    override fun addVideo(videoResponse: VideoResponse?): ResponseEntity<CreateVideoResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoService.create(videoResponse!!))
    }

    override fun searchVideos(q: String?, page: Int, size: Int, sort: String?, order: String?): ResponseEntity<VideosApiResponse> {
        val sortDomain = Sort.by(Sort.Direction.fromString(order ?: "desc"), sort ?: "videoFileInfo.createDate")
        val pages = videoService.pagedSearch(q ?: "", PageRequest.of(page, size, sortDomain))
        return ResponseEntity.ok(
            VideosApiResponse(
            data = VideoPagedResponse(
                page = page,
                size = size,
                totalPages = pages.totalPages,
                totalRecords = pages.totalElements,
                records = pages.toList()
            )
        )
        )
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

    override fun downloadStatic(path: String, download: Boolean, videoId: Long?): ResponseEntity<Resource> {
        val headers = HttpHeaders()
        when {
            videoId != null -> videoService.update(videoId, VideoResponse(
                id = videoId, lastAccessed = OffsetDateTime.now()))
        }

        val resource = resourceService.downloadStatic(path)
        if (listOf("png", "jpg").contains(resource.file.extension)) {
            headers.lastModified = resource.lastModified()
        }

        if (download) {
            headers.set("Content-Disposition", "attachment; filename=\"${resource.filename}\"")
        }
        return ResponseEntity.status(HttpStatus.OK).headers(headers).body(resource)
    }
}
