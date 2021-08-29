package com.gum.pmanager.service

import com.gum.pmanager.controller.VideoNotFoundException
import org.springframework.core.io.PathResource
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import java.net.URI

interface ResourceService {
    fun downloadStatic(path: String): Resource
}

@Service
class ResourceServiceImpl : ResourceService {
    override fun downloadStatic(path: String): Resource {
        val resource = PathResource(URI.create(path))
        if (!resource.exists()) {
            throw VideoNotFoundException("Not found")
        }
        return resource
    }
}
