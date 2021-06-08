package com.gum.pmanager.config

import org.openapitools.client.apis.VideosApi
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class IndexerConfiguration {
    @Bean
    fun openApiClient(indexingProperties: IndexingProperties) = VideosApi(indexingProperties.apiBasePath)
}
