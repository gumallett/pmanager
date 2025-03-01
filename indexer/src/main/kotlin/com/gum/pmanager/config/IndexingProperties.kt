package com.gum.pmanager.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "indexing")
data class IndexingProperties(val paths: List<String>, val apiBasePath: String, val runOnStart: Boolean = true)
