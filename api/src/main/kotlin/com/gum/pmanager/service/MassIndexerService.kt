package com.gum.pmanager.service

import com.gum.pmanager.data.repository.VideoMetadataRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class MassIndexerService(private val searchRepository: VideoMetadataRepository) {
    private val LOG: Logger = LoggerFactory.getLogger(MassIndexerService::class.java)

    fun reIndex(): ResponseEntity<Unit> {
        searchRepository.reIndex()
            .thenRun { LOG.info("Mass Index completed.") }
            .exceptionally { e ->
                LOG.error("Mass index failed: ", e)
                null
            }
        return ResponseEntity.ok().build()
    }
}
