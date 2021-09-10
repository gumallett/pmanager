package com.gum.pmanager.data.repository

import com.gum.pmanager.data.model.VideoMetadataEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.Instant


@Repository
interface VideoMetadataRepository : JpaRepository<VideoMetadataEntity, Long>, SearchRepository {
    fun findByUri(uri: String) : VideoMetadataEntity?

    @Modifying
    @Query("update VideoMetadataEntity u set u.lastAccessed = ?2, u.views = (u.views + 1) where u.id = ?1")
    fun setViewed(id: Long, lastAccessed: Instant): Int
}
