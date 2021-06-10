package com.gum.pmanager.data.repository;

import com.gum.pmanager.data.model.VideoMetadataEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SearchRepository {
    List<VideoMetadataEntity> search(String query, Pageable pageable);
}
