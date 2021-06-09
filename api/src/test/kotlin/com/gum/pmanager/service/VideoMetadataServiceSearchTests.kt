package com.gum.pmanager.service

import com.gum.pmanager.createTestEntity
import com.gum.pmanager.data.model.VideoMetadataEntity
import com.gum.pmanager.data.repository.VideoMetadataRepository
import com.gum.pmanager.ensureTx
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.PageRequest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.transaction.TestTransaction
import org.springframework.transaction.annotation.Transactional
import java.time.ZoneOffset

@SpringBootTest
@TestPropertySource(properties = ["spring.flyway.cleanOnValidationError=true",
    "spring.jpa.properties.hibernate.search.automatic_indexing.synchronization.strategy=sync"])
class VideoMetadataServiceSearchTests {

    @Autowired
    lateinit var videoMetadataService: VideoMetadataService

    @Autowired
    lateinit var videoMetadataRepository: VideoMetadataRepository

    @AfterEach
    fun cleanup() {
        ensureTx()
        videoMetadataRepository.deleteAll()
        TestTransaction.flagForCommit()
        TestTransaction.end()
    }

    @Test
    @Transactional
    fun `search should return video`() {
        val entity = createAndSaveTestEntity()
        ensureTx()

        val listResult = videoMetadataService.search(entity.title, PageRequest.of(0, 10))

        Assertions.assertThat(listResult.size).isEqualTo(1)
        val res = listResult.first()
        Assertions.assertThat(res.id).isEqualTo(entity.id)

        Assertions.assertThat(res.title).isEqualTo(entity.title)
        Assertions.assertThat(res.description).isEqualTo(entity.description)
        Assertions.assertThat(res.source).isEqualTo(entity.source)
        Assertions.assertThat(res.views).isEqualTo(entity.views)
        Assertions.assertThat(res.notes).isEqualTo(entity.notes)
        Assertions.assertThat(res.lastModified).isEqualTo(entity.lastModified.atOffset(ZoneOffset.UTC))
        Assertions.assertThat(res.uri).isEqualTo(entity.uri)

        Assertions.assertThat(res.videoFileInfo?.contentType).isEqualTo(entity.videoFileInfo.contentType)
        Assertions.assertThat(res.videoFileInfo?.createDate)
            .isEqualTo(entity.videoFileInfo.createDate.atOffset(ZoneOffset.UTC))
        Assertions.assertThat(res.videoFileInfo?.filename).isEqualTo(entity.videoFileInfo.filename)
        Assertions.assertThat(res.videoFileInfo?.length).isEqualTo(entity.videoFileInfo.length.toMillis())
        Assertions.assertThat(res.videoFileInfo?.size).isEqualTo(entity.videoFileInfo.size)
    }

    private fun createAndSaveTestEntity(): VideoMetadataEntity {
        ensureTx()
        val entity = videoMetadataRepository.saveAndFlush(createTestEntity())
        TestTransaction.flagForCommit()
        TestTransaction.end()
        return entity
    }
}
