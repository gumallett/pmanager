package com.gum.pmanager.data.repository;

import com.gum.pmanager.data.model.VideoMetadataEntity;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.mapper.orm.Search;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.List;

public class SearchRepositoryImpl implements SearchRepository {
    private final EntityManager entityManager;

    public SearchRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    @Override
    public List<VideoMetadataEntity> search(String query, Pageable pageable) {
        var session = Search.session(entityManager);
        SearchResult<VideoMetadataEntity> result = session
                .search(VideoMetadataEntity.class)
                .where(p -> {
                    var qs = p.simpleQueryString()
                            .field("title")
                            .field("description")
                            .field("notes")
                            .matching(query);
                    return p.bool().must(StringUtils.hasLength(query) ? qs : p.matchAll());
                })
                .fetch(pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());

        return result.hits();
    }
}
