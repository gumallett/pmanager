rootProject.name = "pmanager"
enableFeaturePreview("VERSION_CATALOGS")

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            version("kotlin", "1.6.21")
            version("springboot", "2.7.7")
            version("openapi", "6.2.1")
            plugin("springboot", "org.springframework.boot").versionRef("springboot")
            plugin("openapi", "org.openapi.generator").versionRef("openapi")
            version("hibernateSearch", "6.1.7.Final")
            library("hibernateSearch", "org.hibernate.search", "hibernate-search-mapper-orm").versionRef("hibernateSearch")
            library("hibernateSearchBackend", "org.hibernate.search", "hibernate-search-backend-lucene").versionRef("hibernateSearch")
            bundle("hibernateSearch", listOf("hibernateSearch", "hibernateSearchBackend"))
        }
    }
}

include("api")
include("indexer")
