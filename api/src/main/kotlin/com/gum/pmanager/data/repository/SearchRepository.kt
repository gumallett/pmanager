package com.gum.pmanager.data.repository

import com.gum.pmanager.data.model.VideoMetadataEntity
import org.hibernate.search.engine.search.query.SearchResult
import org.hibernate.search.mapper.orm.Search
import org.springframework.data.domain.Pageable
import javax.persistence.EntityManager

interface SearchRepository {
    fun search(query: String?, pageable: Pageable): List<VideoMetadataEntity>
}

@Suppress("UNCHECKED_CAST")
class SearchRepositoryImpl(private val entityManager: EntityManager) : SearchRepository {
    override fun search(query: String?, pageable: Pageable): List<VideoMetadataEntity> {
        val session = Search.session(entityManager)

        val result: SearchResult<VideoMetadataEntity> = session
            .search(VideoMetadataEntity::class.java)
            .where { p ->
                p.bool().must(
                    p.simpleQueryString()
                        .field("title")
                        .field("description")
                        .matching(query)
                )
            }
            .fetch(pageable.pageSize * pageable.pageNumber, pageable.pageSize) as SearchResult<VideoMetadataEntity>


        return result.hits().toList()
    }

}
