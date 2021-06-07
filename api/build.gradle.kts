import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "2.4.5"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    kotlin("jvm")
    kotlin("plugin.spring") version "1.5.10"
    kotlin("plugin.allopen") version "1.5.10"
    kotlin("plugin.jpa") version "1.5.10"
    id("org.openapi.generator") version "5.1.1"
}

group = "com.gum"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.hibernate.search:hibernate-search-mapper-orm:6.0.3.Final")
    implementation("org.hibernate.search:hibernate-search-backend-lucene:6.0.3.Final")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.flywaydb:flyway-core")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

allOpen {
    annotation("javax.persistence.Entity")
    annotation("javax.persistence.Embeddable")
    annotation("javax.persistence.MappedSuperclass")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "11"
    }
    dependsOn("openApiGenerate")
}

kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("$buildDir/generated/src/main/kotlin")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

openApiMeta {
    packageName.set("com.gum.pmanager.api")
    outputFolder.set("$buildDir/meta")
}

openApiGenerate {
    generatorName.set("kotlin-spring")
    inputSpec.set("${rootDir}/swagger-lib/video-api.yaml")
    outputDir.set("$buildDir/generated")
    apiPackage.set("com.gum.pmanager.api")
    modelPackage.set("com.gum.pmanager.model")
    globalProperties.set(mapOf(
        "models" to "",
        "apis" to "",
        "invoker" to "false"
    ))
    configOptions.set(mapOf(
        "dateLibrary" to "java8",
        "interfaceOnly" to "true"
    ))
}

tasks.create<Exec>("dockerStartPostgres") {
    commandLine("docker", "run", "-d", "--name", "pm-pgsql", "-p", "5432:5432", "-e", "POSTGRES_PASSWORD=postgres", "postgres")
}

tasks.create("dockerStopPostgres") {
    doLast {
        exec {
            commandLine("docker", "stop", "pm-pgsql")
        }

        exec {
            commandLine("docker", "rm", "pm-pgsql")
        }
    }
}

//tasks.create<Exec>("dockerStopPostgres") {
//    commandLine("docker", "stop", "pm-pgsql")
//}
//
//tasks.create<Exec>("dockerRemovePostgres") {
//    commandLine("docker", "rm", "pm-pgsql")
//}

tasks.create<Exec>("dockerStartElasticsearch") {
    commandLine("docker", "run", "-d", "--name", "pm-elastic", "-p", "9200:9200", "-p", "9300:9300", "-e", "discovery.type=single-node", "-e", "ES_JAVA_OPTS=-Xms750m -Xmx750m", "docker.elastic.co/elasticsearch/elasticsearch:7.12.1")
}

tasks.create<Exec>("dockerStopElasticsearch") {
    commandLine("docker", "stop", "pm-elastic")
    commandLine("docker", "rm", "pm-elastic")
}
