package com.gum.pmanager.data.model

import org.hibernate.search.engine.backend.types.Projectable
import org.hibernate.search.engine.backend.types.Sortable
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.*
import java.time.Duration
import java.time.Instant
import javax.persistence.*

@Entity
@Table(name = "video_metadata")
@Indexed
class VideoMetadataEntity(
    @Id
    @GeneratedValue
    var id: Long? = null,

    @FullTextField
    @KeywordField(name = "title_sort", sortable = Sortable.YES)
    var title: String,

    @FullTextField
    var description: String,

    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var uri: String,

    @OneToMany(mappedBy = "video", cascade = [CascadeType.ALL])
    @IndexedEmbedded
    var categories: MutableList<CategoryEntity> = ArrayList(),

    @OneToMany(mappedBy = "video", cascade = [CascadeType.ALL])
    @IndexedEmbedded
    var tags: MutableList<TagEntity> = ArrayList(),

    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
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
    var lastModified: Instant
)

@Embeddable
class VideoFileInfo(

    @Column(name = "filename")
    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var filename: String,

    @Column(name = "content_type")
    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var contentType: String,

    @Column(name = "size")
    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var size: Long,

    @Column(name = "length")
    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var length: Duration,

    @Column(name = "create_date")
    @GenericField(sortable = Sortable.YES, projectable = Projectable.YES)
    var createDate: Instant
)

@Entity
@Table(name = "categories")
class CategoryEntity(
    @Id
    @GeneratedValue
    var id: Long? = null,

    @KeywordField(sortable = Sortable.YES, projectable = Projectable.YES)
    var name: String,

    @ManyToOne
    var video: VideoMetadataEntity
)

@Entity
@Table(name = "tags")
class TagEntity(
    @Id
    @GeneratedValue
    var id: Long? = null,

    @KeywordField
    var name: String,

    @ManyToOne
    var video: VideoMetadataEntity
)
