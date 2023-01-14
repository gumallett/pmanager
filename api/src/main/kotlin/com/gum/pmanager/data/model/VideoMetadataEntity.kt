package com.gum.pmanager.data.model

import com.gum.pmanager.model.CategoryResponse
import com.gum.pmanager.model.TagResponse
import com.gum.pmanager.model.VideoFileInfoResponse
import com.gum.pmanager.model.VideoResponse
import org.hibernate.search.engine.backend.types.Aggregable
import org.hibernate.search.engine.backend.types.Projectable
import org.hibernate.search.engine.backend.types.Sortable
import org.hibernate.search.mapper.pojo.automaticindexing.ReindexOnUpdate
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.*
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import javax.persistence.*

@Entity
@Table(name = "video_metadata")
@Indexed
class VideoMetadataEntity(
    @Id
    @DocumentId
    @GeneratedValue
    var id: Long? = null,

    @FullTextField
    @KeywordField(name = "title_sort", sortable = Sortable.YES)
    var title: String,

    @FullTextField
    var description: String,

    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var uri: String,

    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var previewUri: String,

    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var thumbUri: String,

    @OneToMany(cascade = [CascadeType.ALL])
    @IndexedEmbedded
    @IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
    var categories: MutableList<CategoryEntity> = ArrayList(),

    @OneToMany(cascade = [CascadeType.ALL])
    @IndexedEmbedded
    @IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
    var tags: MutableList<TagEntity> = ArrayList(),

    @FullTextField
    @KeywordField(name="source_sort", sortable = Sortable.YES, projectable = Projectable.YES)
    var source: String,

    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var rating: Short? = null,

    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var views: Long,

    @FullTextField
    var notes: String,

    @IndexedEmbedded
    var videoFileInfo: VideoFileInfo,

    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var lastAccessed: Instant? = null,

    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var lastModified: Instant
)

@Embeddable
class VideoFileInfo(

    @Column(name = "filename")
    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var filename: String = "",

    @Column(name = "content_type")
    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var contentType: String = "",

    @Column(name = "size")
    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var size: Long = 0,

    @Column(name = "length")
    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var length: Duration = Duration.ZERO,

    @Column(name = "width")
    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var width: Long? = null,

    @Column(name = "height")
    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var height: Long? = null,

    @Column(name = "file_create_date")
    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var createDate: Instant = Instant.now()
)

@Entity
@Table(name = "categories")
class CategoryEntity(
    @Id
    @GeneratedValue
    var id: Long? = null,

    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES, aggregable = Aggregable.YES)
    var name: String
)

@Entity
@Table(name = "tags")
class TagEntity(
    @Id
    @GeneratedValue
    var id: Long? = null,

    @FullTextField
    @KeywordField(name = "name_sort", sortable = Sortable.YES, projectable = Projectable.YES, aggregable = Aggregable.YES)
    var name: String
)

fun CategoryResponse.toCategoryEntity() = CategoryEntity(
    name = name
)

fun CategoryEntity.toCategoryResponse() = CategoryResponse(
    name = name
)

fun TagResponse.toTagEntity() = TagEntity(
    name = name
)

fun TagEntity.toTagResponse() = TagResponse(
    name = name
)

fun VideoFileInfoResponse.copyToVideoFileInfoEntity() = VideoFileInfo(
    filename = filename ?: "",
    contentType = contentType ?: "",
    size = propertySize ?: 0L,
    length = Duration.ofMillis(length ?: 0),
    width = width,
    height = height,
    createDate = createDate?.toInstant() ?: Instant.now()
)

fun VideoFileInfoResponse.copyToVideoFileInfoEntity(update: VideoFileInfo) {
    if (filename != null) {
        update.filename = filename
    }

    if (contentType != null) {
        update.contentType = contentType
    }

    if (propertySize != null) {
        update.size = propertySize
    }

    if (createDate != null) {
        update.createDate = createDate.toInstant()
    }

    if (length != null) {
        update.length = Duration.ofMillis(length)
    }
}

fun VideoFileInfo.toVideoFileInfoResponse() = VideoFileInfoResponse(
    filename = filename,
    contentType = contentType,
    propertySize = size,
    length = length.toMillis(),
    width = width,
    height = height,
    createDate = createDate.atOffset(ZoneOffset.UTC)
)

fun VideoResponse.copyToVideoMetadataEntity() = VideoMetadataEntity(
    id = id,
    title = title ?: "",
    description = description ?: "",
    uri = uri ?: "",
    thumbUri = thumbUri ?: "",
    previewUri = previewUri ?: "",
    categories = categories?.map { it.toCategoryEntity() }?.toMutableList() ?: mutableListOf(),
    tags = tags?.map { it.toTagEntity() }?.toMutableList() ?: mutableListOf(),
    source = source ?: "",
    rating = rating?.toShort(),
    views = views ?: 0L,
    notes = notes ?: "",
    videoFileInfo = videoFileInfo?.copyToVideoFileInfoEntity() ?: VideoFileInfo(),
    lastAccessed = lastAccessed?.toInstant(),
    lastModified = lastModified?.toInstant() ?: Instant.now()
)

fun VideoResponse.copyToVideoMetadataEntity(update: VideoMetadataEntity) {
    if (description != null) {
        update.description = description
    }

    if (title != null) {
        update.title = title
    }

    if (uri != null) {
        update.uri = uri
    }

    if (notes != null) {
        update.notes = notes
    }

    if (source != null) {
        update.source = source
    }

    if (views != null) {
        update.views = views
    }

    if (rating != null) {
        update.rating = rating.toShort()
    }

    if (lastAccessed != null) {
        update.lastAccessed = lastAccessed.toInstant()
    }

    if (lastModified != null) {
        update.lastModified = lastModified.toInstant()
    }

    if (categories != null) {
        update.categories = categories.map { it.toCategoryEntity() }.toMutableList()
    }

    if (tags != null) {
        update.tags = tags.map { it.toTagEntity() }.toMutableList()
    }

    videoFileInfo?.copyToVideoFileInfoEntity(update.videoFileInfo)
}

fun VideoMetadataEntity.toVideoMetadataResponse() = VideoResponse(
    id = id,
    title = title,
    description = description,
    uri = uri,
    thumbUri = thumbUri,
    previewUri = previewUri,
    categories = categories.map { it.toCategoryResponse() },
    tags = tags.map { it.toTagResponse() },
    source = source,
    rating = rating?.toInt(),
    views = views,
    notes = notes,
    videoFileInfo = videoFileInfo.toVideoFileInfoResponse(),
    lastAccessed = lastAccessed?.atOffset(ZoneOffset.UTC),
    lastModified = lastModified.atOffset(ZoneOffset.UTC)
)
