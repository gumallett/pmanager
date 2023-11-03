package com.gum.pmanager.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConfigurationProperties(prefix = "indexing")
@ConstructorBinding
data class IndexingProperties(val paths: List<String>, val apiBasePath: String, val runOnStart: Boolean = true)
