package com.gum.pmanager.data.repository

import com.gum.pmanager.data.model.VideoMetadataEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VideoMetadataRepository : JpaRepository<VideoMetadataEntity, Long>, SearchRepository
