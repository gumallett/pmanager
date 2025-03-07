package com.gum.pmanager.data.repository;

import com.gum.pmanager.data.model.CategoryEntity;
import com.gum.pmanager.data.model.SearchFilters;
import com.gum.pmanager.data.model.TagEntity;
import com.gum.pmanager.data.model.VideoMetadataEntity;
import jakarta.persistence.EntityManager;
import org.hibernate.search.engine.search.aggregation.AggregationKey;
import org.hibernate.search.engine.search.predicate.SearchPredicate;
import org.hibernate.search.engine.search.predicate.dsl.BooleanPredicateClausesStep;
import org.hibernate.search.engine.search.predicate.dsl.SearchPredicateFactory;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.engine.search.sort.dsl.SortOrder;
import org.hibernate.search.mapper.orm.Search;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletionStage;
import java.util.stream.Collectors;

public class SearchRepositoryImpl implements SearchRepository {
    private final EntityManager entityManager;

    public SearchRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Page<VideoMetadataEntity> pagedSearch(String query, Pageable pageable) {
        return pagedSearch(query, pageable, new SearchFilters(List.of(), List.of(), List.of(), List.of(), Duration.ZERO, Duration.ofMillis(Integer.MAX_VALUE)));
    }

    public Page<VideoMetadataEntity> pagedSearch(String query, Pageable pageable, SearchFilters searchFilters) {
        var session = Search.session(entityManager);
        SearchResult<VideoMetadataEntity> result = session
                .search(VideoMetadataEntity.class)
                .where(p -> {
                    var bool = queryString(query, p);
                    var tagsFilter = fieldFilter("tags.name_sort", searchFilters.getTags(), searchFilters.getExcludeTags(), p, false);
                    if (tagsFilter != null) {
                        bool.filter(tagsFilter);
                    }
                    var categoriesFilter = fieldFilter("categories.name", searchFilters.getCategories(), List.of(), p, false);
                    if (categoriesFilter != null) {
                        bool.filter(categoriesFilter);
                    }
                    var sourcesFilter = fieldFilter("source_sort", searchFilters.getSources(), List.of(), p, false);
                    if (sourcesFilter != null) {
                        bool.filter(sourcesFilter);
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

    public List<VideoMetadataEntity> recommended(VideoMetadataEntity sourceVideo, Pageable pageable) {
        final var session = Search.session(entityManager);
        SearchResult<VideoMetadataEntity> result = session
                .search(VideoMetadataEntity.class)
                .where(p -> p.bool()
                        .mustNot(f -> f.id().matching(sourceVideo.getId()))
                        .must(p2 -> {
                            var query = p2.bool()
                                    .should(p3 -> p3.match()
                                            .field("title").boost( 2.0f )
                                            .field("description")
                                            .field("tags.name")
                                            .field("categories.name")
                                            .field("notes")
                                            .matching(sourceVideo.getTitle()).boost(2.0f));

                            if (!sourceVideo.getNotes().isEmpty()) {
                                query.should(p3 -> p3.match().field("notes").matching(sourceVideo.getNotes()));
                            }

                            if (!sourceVideo.getDescription().isEmpty()) {
                                query.should(p3 -> p3.match().field("description").matching(sourceVideo.getDescription()));
                            }

                            if (!sourceVideo.getSource().isEmpty()) {
                                query.should(p3 -> p3.match().field("source").matching(sourceVideo.getSource()).boost(2.0f));
                            }

                            if (!sourceVideo.getTags().isEmpty()) {
                                query.should(p3 -> p3.terms()
                                        .field("tags.name").boost(2.0f)
                                        .field("categories.name")
                                        .field("description")
                                        .field("title")
                                        .field("notes")
                                        .matchingAny(sourceVideo.getTags().stream().map(TagEntity::getName).collect(Collectors.toList())).boost(2.0f));
                            }

                            if (!sourceVideo.getCategories().isEmpty()) {
                                query.should(p3 -> p3.terms()
                                        .field("categories.name").boost(10.0f)
                                        .field("tags.name")
                                        .field("description")
                                        .field("title")
                                        .field("notes")
                                        .matchingAny(sourceVideo.getCategories().stream().map(CategoryEntity::getName).collect(Collectors.toList())).boost(2.0f));
                            }

                            return query;
                        }))
                .sort(s -> s.score().desc().then().field("rating").desc().then().field("views").desc())
                .fetch(pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());

        return new PageImpl<>(result.hits(), pageable, result.total().hitCount()).toList();
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
                .aggregation(aggKey, f -> f.terms().field("categories.name", String.class).maxTermCount(1000))
                .fetch(1000)
                .aggregation(aggKey);
    }

    @Override
    public Map<String, Long> allTags(String query) {
        var searchSession = Search.session(entityManager);
        AggregationKey<Map<String, Long>> aggKey = AggregationKey.of("alltags");

        return searchSession
                .search(VideoMetadataEntity.class)
                .where(p -> queryString(query, p))
                .aggregation(aggKey, f -> f.terms().field("tags.name_sort", String.class).maxTermCount(1000))
                .fetch(0, 1000)
                .aggregation(aggKey);
    }

    @Override
    public Map<String, Long> allSources(String query) {
        var searchSession = Search.session(entityManager);
        AggregationKey<Map<String, Long>> aggKey = AggregationKey.of("allsources");

        return searchSession
                .search(VideoMetadataEntity.class)
                .where(p -> queryString(query, p))
                .aggregation(aggKey, f -> f.terms().field("source_sort", String.class).maxTermCount(1000))
                .fetch(1000)
                .aggregation(aggKey);
    }

    private BooleanPredicateClausesStep<?> queryString(String query, SearchPredicateFactory p) {
        var qs = p.simpleQueryString()
                .field("title").boost(2.0f)
                .field("description")
                .field("notes")
                .field("source")
                .field("tags.name").boost(2.0f)
                .field("categories.name").boost(2.0f)
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
