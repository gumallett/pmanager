package com.gum.pmanager.controller

import com.gum.pmanager.api.VideosApiController
import com.gum.pmanager.model.CreateVideoResponse
import com.gum.pmanager.model.VideoResponse
import org.springframework.http.ResponseEntity

class VideoControllerImpl: VideosApiController() {

    override fun addVideo(videoResponse: VideoResponse?): ResponseEntity<CreateVideoResponse> {
        return super.addVideo(videoResponse)
    }

    override fun searchVideos(searchString: String?, page: Int, size: Int): ResponseEntity<List<VideoResponse>> {
        return super.searchVideos(searchString, page, size)
    }

    override fun updateVideo(id: Int, videoResponse: VideoResponse?): ResponseEntity<Unit> {
        return super.updateVideo(id, videoResponse)
    }
}
