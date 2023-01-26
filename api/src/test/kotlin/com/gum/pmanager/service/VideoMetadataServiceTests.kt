package com.gum.pmanager.service

import com.gum.pmanager.createTestEntity
import com.gum.pmanager.createTestVideoResponse
import com.gum.pmanager.data.model.VideoMetadataEntity
import com.gum.pmanager.data.repository.VideoMetadataRepository
import com.gum.pmanager.model.VideoResponse
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.transaction.annotation.Transactional
import java.time.ZoneOffset

@SpringBootTest
@TestPropertySource(properties = ["spring.flyway.cleanOnValidationError=true"])
class VideoMetadataServiceTests {

    @Autowired
    lateinit var videoMetadataService: VideoMetadataService

    @Autowired
    lateinit var videoMetadataRepository: VideoMetadataRepository

    @Test
    @Transactional
    fun `delete should delete existing video`() {
        val entityId = createAndSaveTestEntity().id!!
        videoMetadataService.delete(entityId)

        val entity = videoMetadataRepository.findById(entityId)
        assertThat(entity.isEmpty).isTrue
    }

    @Test
    @Transactional
    fun `create should create video`() {
        val request = createTestVideoResponse()

        val res = videoMetadataService.create(request)
        assertThat(res.id).isNotNull
    }

    @Test
    @Transactional
    fun `get should return video`() {
        val entity = createAndSaveTestEntity()
        val res = videoMetadataService.get(entity.id!!)
        assertThat(res.id).isEqualTo(entity.id)

        assertThat(res.title).isEqualTo(entity.title)
        assertThat(res.description).isEqualTo(entity.description)
        assertThat(res.source).isEqualTo(entity.source)
        assertThat(res.views).isEqualTo(entity.views)
        assertThat(res.notes).isEqualTo(entity.notes)
        assertThat(res.lastModified).isEqualTo(entity.lastModified.atOffset(ZoneOffset.UTC))
        assertThat(res.uri).isEqualTo(entity.uri)

        assertThat(res.videoFileInfo?.contentType).isEqualTo(entity.videoFileInfo.contentType)
        assertThat(res.videoFileInfo?.createDate).isEqualTo(entity.videoFileInfo.createDate.atOffset(ZoneOffset.UTC))
        assertThat(res.videoFileInfo?.filename).isEqualTo(entity.videoFileInfo.filename)
        assertThat(res.videoFileInfo?.length).isEqualTo(entity.videoFileInfo.length.toMillis())
        assertThat(res.videoFileInfo?.propertySize).isEqualTo(entity.videoFileInfo.size)
    }

    @Test
    @Transactional
    fun `update should update video`() {
        val entity = createAndSaveTestEntity()
        val request = VideoResponse(
            id = entity.id,
            description = "test2"
        )
        val res = videoMetadataService.update(request.id, request)
        assertThat(res.id).isEqualTo(entity.id)

        val updated = videoMetadataService.get(res.id!!)
        assertThat(updated.description).isEqualTo(request.description)
    }

    private fun createAndSaveTestEntity(): VideoMetadataEntity {
        return videoMetadataRepository.saveAndFlush(createTestEntity())
    }
}
