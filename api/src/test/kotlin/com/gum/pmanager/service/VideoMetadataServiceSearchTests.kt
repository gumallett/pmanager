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
    "spring.jpa.properties.hibernate.search.automatic_indexing.synchronization.strategy=sync",
    "spring.jpa.properties.hibernate.search.backend.directory.root=",
    "spring.jpa.properties.hibernate.search.backend.indexes.VideoMetadataEntity.directory.root="
])
class VideoMetadataServiceSearchTests {

    @Autowired
    lateinit var videoMetadataService: VideoMetadataService

    @Autowired
    lateinit var videoMetadataRepository: VideoMetadataRepository

    var entityId: Long? = null
    var entity2Id: Long? = null

    @AfterEach
    fun cleanup() {
        if (entityId != null) {
            ensureTx()
            videoMetadataRepository.deleteById(entityId!!)
            TestTransaction.flagForCommit()
            TestTransaction.end()
        }

        if (entity2Id != null) {
            ensureTx()
            videoMetadataRepository.deleteById(entity2Id!!)
            TestTransaction.flagForCommit()
            TestTransaction.end()
        }
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
        Assertions.assertThat(res.videoFileInfo?.propertySize).isEqualTo(entity.videoFileInfo.size)
    }

    @Test
    @Transactional
    fun `related search should return related video`() {
        val entity = createAndSaveTestEntity()
        val entity2 = createAndSaveTestEntity()
        entity2.title = "test related video"
        ensureTx()

        val listResult = videoMetadataService.related(entity.id!!)

        Assertions.assertThat(listResult.size).isEqualTo(1)
        val res = listResult.first()
        Assertions.assertThat(res.id).isEqualTo(entity2.id)

        Assertions.assertThat(res.title).isEqualTo(entity2.title)
        Assertions.assertThat(res.description).isEqualTo(entity2.description)
        Assertions.assertThat(res.source).isEqualTo(entity2.source)
        Assertions.assertThat(res.views).isEqualTo(entity2.views)
        Assertions.assertThat(res.notes).isEqualTo(entity2.notes)
        Assertions.assertThat(res.lastModified).isEqualTo(entity2.lastModified.atOffset(ZoneOffset.UTC))
        Assertions.assertThat(res.uri).isEqualTo(entity2.uri)

        Assertions.assertThat(res.videoFileInfo?.contentType).isEqualTo(entity2.videoFileInfo.contentType)
        Assertions.assertThat(res.videoFileInfo?.createDate)
            .isEqualTo(entity2.videoFileInfo.createDate.atOffset(ZoneOffset.UTC))
        Assertions.assertThat(res.videoFileInfo?.filename).isEqualTo(entity2.videoFileInfo.filename)
        Assertions.assertThat(res.videoFileInfo?.length).isEqualTo(entity2.videoFileInfo.length.toMillis())
        Assertions.assertThat(res.videoFileInfo?.propertySize).isEqualTo(entity2.videoFileInfo.size)
    }

    private fun createAndSaveTestEntity(): VideoMetadataEntity {
        ensureTx()
        val entity = videoMetadataRepository.saveAndFlush(createTestEntity())
        entityId = entity.id
        TestTransaction.flagForCommit()
        TestTransaction.end()
        return entity
    }

    private fun createAndSaveTestEntity2(): VideoMetadataEntity {
        ensureTx()
        val entity = videoMetadataRepository.saveAndFlush(createTestEntity())
        entity2Id = entity.id
        TestTransaction.flagForCommit()
        TestTransaction.end()
        return entity
    }
}
