package com.gum.pmanager

import com.gum.pmanager.data.model.VideoFileInfo
import com.gum.pmanager.data.model.VideoMetadataEntity
import com.gum.pmanager.model.VideoFileInfoResponse
import com.gum.pmanager.model.VideoResponse
import org.springframework.test.context.transaction.TestTransaction
import java.time.Duration
import java.time.Instant
import java.time.OffsetDateTime
import java.time.temporal.ChronoUnit

fun createTestEntity() = VideoMetadataEntity(
    title = "test",
    description = "test",
    uri = "test",
    previewUri = "",
    thumbUri = "",
    categories = mutableListOf(),
    tags = mutableListOf(),
    source = "test",
    views = 0L,
    notes = "",
    lastModified = Instant.now().truncatedTo(ChronoUnit.MILLIS),
    videoFileInfo = VideoFileInfo(
        filename = "test.mp4",
        contentType = "video/mp4",
        size = 1L,
        length = Duration.ofMinutes(10),
        createDate = Instant.now().truncatedTo(ChronoUnit.MILLIS)
    )
)

fun createTestVideoResponse() = VideoResponse(
    title = "test",
    description = "test",
    uri = "test",
    categories = mutableListOf(),
    tags = mutableListOf(),
    source = "test",
    views = 0L,
    notes = "",
    lastModified = OffsetDateTime.now(),
    videoFileInfo = VideoFileInfoResponse(
        filename = "test.mp4",
        contentType = "video/mp4",
        size = 1L,
        length = Duration.ofMinutes(10).toMillis(),
        createDate = OffsetDateTime.now()
    )
)

fun ensureTx() {
    if (!TestTransaction.isActive()) {
        TestTransaction.start()
    }
}
