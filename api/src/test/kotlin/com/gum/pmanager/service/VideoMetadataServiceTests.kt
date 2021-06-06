package com.gum.pmanager.service

import com.gum.pmanager.VideoMetadataService
import com.gum.pmanager.data.model.VideoFileInfo
import com.gum.pmanager.data.model.VideoMetadataEntity
import com.gum.pmanager.data.repository.VideoMetadataRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import java.time.Duration
import java.time.Instant

@SpringBootTest
@TestPropertySource(properties = ["spring.flyway.cleanOnValidationError=true"])
class VideoMetadataServiceTests {

    @Autowired
    lateinit var videoMetadataService: VideoMetadataService

    @Autowired
    lateinit var videoMetadataRepository: VideoMetadataRepository

    @Test
    fun `delete should delete existing video`() {
        val entityId = createTestEntity()
        videoMetadataService.delete(entityId)

        val entity = videoMetadataRepository.findById(entityId)
        assertThat(entity.isEmpty).isTrue
    }

    private fun createTestEntity(): Long {
        var entity = VideoMetadataEntity(
            title = "test",
            description = "test",
            uri = "test",
            categories = mutableListOf(),
            tags = mutableListOf(),
            source = "test",
            views = 0L,
            notes = "",
            lastModified = Instant.now(),
            videoFileInfo = VideoFileInfo(
                filename = "test.mp4",
                contentType = "video/mp4",
                size = 1L,
                length = Duration.ofMinutes(10),
                createDate = Instant.now()
            )
        )
        entity = videoMetadataRepository.saveAndFlush(entity)
        return entity.id!!
    }
}
