package com.gum.pmanager.data.model

import java.time.Duration

class SearchFilters (
    val tags: List<String>,
    val excludeTags: List<String>,
    val categories: List<String>,
    val sources: List<String>,
    val lengthFrom: Duration,
    val lengthTo: Duration
)
