package com.gum.pmanager.controller

import com.gum.pmanager.api.VideosApi
import com.gum.pmanager.data.model.SearchFilters
import com.gum.pmanager.model.*
import com.gum.pmanager.service.MassIndexerService
import com.gum.pmanager.service.ResourceService
import com.gum.pmanager.service.VideoMetadataService
import org.springframework.core.io.Resource
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController
import java.time.Duration

@RestController
@CrossOrigin
class VideoControllerImpl(
    private val videoService: VideoMetadataService,
    private val resourceService: ResourceService,
    private val massIndexerService: MassIndexerService
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

    override fun searchVideos(q: String?, tags: List<String>?, excludeTags: List<String>?, categories: List<String>?, sources: List<String>?, lengthFrom: Int, lengthTo: Int, page: Int, size: Int, sort: String?, order: String?): ResponseEntity<VideosApiResponse> {
        val pages = videoService.pagedSearch(q ?: "", getSort(page, size, sort, order), SearchFilters(tags ?: listOf(), excludeTags ?: listOf(), categories ?: listOf(), sources ?: listOf(), lengthFrom = Duration.ofMillis(lengthFrom.toLong()), lengthTo = Duration.ofMillis(lengthTo.toLong())))
        return ResponseEntity.ok(
            VideosApiResponse(
            data = VideoPagedResponse(
                page = page,
                propertySize = size,
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

    override fun viewVideo(id: Long): ResponseEntity<VideoApiResponse> {
        return ResponseEntity.ok(
            VideoApiResponse(
                data = videoService.view(id)
            ))
    }

    override fun downloadStatic(path: String, download: Boolean, videoId: Long?): ResponseEntity<Resource> {
        val headers = HttpHeaders()
        val resource = resourceService.downloadStatic(path)
        if (listOf("png", "jpg").contains(resource.file.extension)) {
            headers.lastModified = resource.lastModified()
        }

        if (download) {
            headers.set("Content-Disposition", "attachment; filename=\"${resource.filename}\"")
        }
        return ResponseEntity.status(HttpStatus.OK).headers(headers).body(resource)
    }

    override fun reindex(): ResponseEntity<Unit> {
        return massIndexerService.reIndex()
    }

    override fun allCategories(q: String?): ResponseEntity<AllTagsApiResponse> {
        val categories = videoService.allCategories(q ?: "")
        return ResponseEntity.ok(AllTagsApiResponse(
            data = AllTagsPagedResponse(
                page = 1,
                totalPages = 1, propertySize = categories.size, totalRecords = categories.size.toLong(),
                records = categories.entries.map { entry -> AllTagsResponse(name = entry.key, count = entry.value) }))
        )
    }

    override fun allTags(q: String?): ResponseEntity<AllTagsApiResponse> {
        val tags = videoService.allTags(q ?: "")
        return ResponseEntity.ok(AllTagsApiResponse(
            data = AllTagsPagedResponse(
                page = 1,
                totalPages = 1, propertySize = tags.size, totalRecords = tags.size.toLong(),
                records = tags.entries.map { entry -> AllTagsResponse(name = entry.key, count = entry.value) }))
        )
    }

    override fun allSources(q: String?): ResponseEntity<AllTagsApiResponse> {
        val sources = videoService.allSources(q ?: "")
        return ResponseEntity.ok(AllTagsApiResponse(
            data = AllTagsPagedResponse(
                page = 1,
                totalPages = 1, propertySize = sources.size, totalRecords = sources.size.toLong(),
                records = sources.entries.map { entry -> AllTagsResponse(name = entry.key, count = entry.value) }))
        )
    }

    private fun getSort(page: Int, size: Int, sort: String?, order: String?): Pageable {
        if (sort == "_score") {
            return PageRequest.of(page, size, Sort.unsorted())
        }
        val sortProps = sort?.split("\\s*,\\s*".toRegex()) ?: listOf("videoFileInfo.createDate")
        val sortDomain = Sort.by(Sort.Direction.fromString(order ?: "desc"), *sortProps.toTypedArray())
        return PageRequest.of(page, size, sortDomain)
    }
}
