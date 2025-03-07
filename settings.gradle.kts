rootProject.name = "pmanager"
enableFeaturePreview("VERSION_CATALOGS")

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            version("kotlin", "1.9.22")
            version("springboot", "3.2.12")
            version("openapi", "6.6.0")
            plugin("springboot", "org.springframework.boot").versionRef("springboot")
            plugin("openapi", "org.openapi.generator").versionRef("openapi")
            version("hibernateSearch", "7.0.1.Final")
            library("hibernateSearch", "org.hibernate.search", "hibernate-search-mapper-orm").versionRef("hibernateSearch")
            library("hibernateSearchBackend", "org.hibernate.search", "hibernate-search-backend-lucene").versionRef("hibernateSearch")
            bundle("hibernateSearch", listOf("hibernateSearch", "hibernateSearchBackend"))
        }
    }
}

include("api")
include("indexer")
