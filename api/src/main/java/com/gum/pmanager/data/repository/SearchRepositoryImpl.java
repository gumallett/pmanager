package com.gum.pmanager.data.repository;

import com.gum.pmanager.data.model.SearchFilters;
import com.gum.pmanager.data.model.VideoMetadataEntity;
import org.hibernate.search.engine.search.aggregation.AggregationKey;
import org.hibernate.search.engine.search.predicate.SearchPredicate;
import org.hibernate.search.engine.search.predicate.dsl.BooleanPredicateClausesStep;
import org.hibernate.search.engine.search.predicate.dsl.PredicateFinalStep;
import org.hibernate.search.engine.search.predicate.dsl.SearchPredicateFactory;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.engine.search.sort.dsl.SortOrder;
import org.hibernate.search.mapper.orm.Search;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletionStage;

public class SearchRepositoryImpl implements SearchRepository {
    private final EntityManager entityManager;

    public SearchRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Page<VideoMetadataEntity> pagedSearch(String query, Pageable pageable) {
        return pagedSearch(query, List.of(), List.of(), List.of(), pageable, new SearchFilters(Duration.ZERO, Duration.ofMillis(Integer.MAX_VALUE)));
    }

    public Page<VideoMetadataEntity> pagedSearch(String query, List<String> tags, List<String> excludeTags, List<String> categories, Pageable pageable, SearchFilters searchFilters) {
        var session = Search.session(entityManager);
        SearchResult<VideoMetadataEntity> result = session
                .search(VideoMetadataEntity.class)
                .where(p -> {
                    var bool = queryString(query, p);
                    var tagsFilter = fieldFilter("tags.name_sort", tags, excludeTags, p, false);
                    if (tagsFilter != null) {
                        bool.filter(tagsFilter);
                    }
                    var categoriesFilter = fieldFilter("categories.name", categories, List.of(), p, false);
                    if (categoriesFilter != null) {
                        bool.filter(categoriesFilter);
                    }
                    bool.filter(p.range().field("videoFileInfo.length").between(searchFilters.getLengthFrom(), searchFilters.getLengthTo()));
                    return bool;
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

    @Override
    public Map<String, Long> allCategories(String query) {
        var searchSession = Search.session(entityManager);
        AggregationKey<Map<String, Long>> aggKey = AggregationKey.of("allcats");

        return searchSession
                .search(VideoMetadataEntity.class)
                .where(p -> queryString(query, p))
                .aggregation(aggKey, f -> f.terms().field("categories.name", String.class))
                .fetch(0)
                .aggregation(aggKey);
    }

    @Override
    public Map<String, Long> allTags(String query) {
        var searchSession = Search.session(entityManager);
        AggregationKey<Map<String, Long>> aggKey = AggregationKey.of("alltags");

        return searchSession
                .search(VideoMetadataEntity.class)
                .where(p -> queryString(query, p))
                .aggregation(aggKey, f -> f.terms().field("tags.name_sort", String.class))
                .fetch(0)
                .aggregation(aggKey);
    }

    private BooleanPredicateClausesStep<?> queryString(String query, SearchPredicateFactory p) {
        var qs = p.simpleQueryString()
                .field("title").boost(3.0f)
                .field("description")
                .field("notes")
                .field("source")
                .field("tags.name").boost(2.0f)
                .field("categories.name")
                .matching(query);

        return p.bool().must(StringUtils.hasLength(query) ? qs : p.matchAll());
    }

    private SearchPredicate fieldFilter(String field, List<String> match, List<String> exclude, SearchPredicateFactory p, boolean should) {
        if (match.isEmpty() && exclude.isEmpty()) {
            return null;
        }

        var filterQuery = p.bool();
        if (!match.isEmpty()) {
            var tagsBoolQuery = p.bool();
            match.forEach(it -> tagsBoolQuery.should(p.match().field(field).matching(it)));
            if (should) {
                filterQuery.should(tagsBoolQuery);
            } else {
                filterQuery.must(tagsBoolQuery);
            }
        }

        if (!exclude.isEmpty()) {
            var tagsExcludeBoolQuery = p.bool();
            exclude.forEach(it -> tagsExcludeBoolQuery.should(p.match().field(field).matching(it)));
            filterQuery.mustNot(tagsExcludeBoolQuery);
        }

        return filterQuery.toPredicate();
    }
}
