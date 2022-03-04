package com.gum.pmanager.data.repository;

import com.gum.pmanager.data.model.VideoMetadataEntity;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.engine.search.sort.dsl.SortOrder;
import org.hibernate.search.mapper.orm.Search;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.concurrent.CompletionStage;

public class SearchRepositoryImpl implements SearchRepository {
    private final EntityManager entityManager;

    public SearchRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Page<VideoMetadataEntity> pagedSearch(String query, Pageable pageable) {
        var session = Search.session(entityManager);
        SearchResult<VideoMetadataEntity> result = session
                .search(VideoMetadataEntity.class)
                .where(p -> {
                    var qs = p.simpleQueryString()
                            .field("title")
                            .field("description")
                            .field("notes")
                            .field("source")
                            .field("tags.name")
                            .field("categories.name")
                            .matching(query);
                    return p.bool().must(StringUtils.hasLength(query) ? qs : p.matchAll());
                })
                .sort(s -> {
                    if (pageable.getSort().isUnsorted()) {
                        return s.score().desc();
                    }

                    return s.composite(c -> pageable.getSort().stream()
                            .forEach(sort -> {
                                if ("_score".equalsIgnoreCase(sort.getProperty())) {
                                    c.add(s.score().desc());
                                    return;
                                }

                                c.add(s.field(sort.getProperty())
                                        .order(sort.isAscending() ? SortOrder.ASC : SortOrder.DESC));
                            }));
                })
                .fetch(pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());

        return new PageImpl<>(result.hits(), pageable, result.total().hitCount());
    }

    @Override
    public List<VideoMetadataEntity> search(String query, Pageable pageable) {
        return pagedSearch(query, pageable).toList();
    }

    @Override
    public CompletionStage<?> reIndex() {
        var searchSession = Search.session(entityManager);

        return searchSession.massIndexer()
                .idFetchSize( 150 )
                .batchSizeToLoadObjects( 25 )
                .threadsToLoadObjects( 12 )
                .dropAndCreateSchemaOnStart(true)
                .start();
    }
}
