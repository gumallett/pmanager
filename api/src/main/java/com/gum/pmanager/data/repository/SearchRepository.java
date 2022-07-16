package com.gum.pmanager.data.repository;

import com.gum.pmanager.data.model.VideoMetadataEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.concurrent.CompletionStage;

public interface SearchRepository {
    Page<VideoMetadataEntity> pagedSearch(String query, Pageable pageable);
    Page<VideoMetadataEntity> pagedSearch(String query, List<String> tags, List<String> excludeTags, Pageable pageable);
    List<VideoMetadataEntity> search(String query, Pageable pageable);
    CompletionStage<?> reIndex();
}
