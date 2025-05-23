import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

@Suppress("DSL_SCOPE_VIOLATION") // TODO: Remove once KTIJ-19369 is fixed
plugins {
    alias(libs.plugins.springboot)
    kotlin("jvm")
    kotlin("plugin.spring") version libs.versions.kotlin
    kotlin("plugin.allopen") version libs.versions.kotlin
    kotlin("plugin.jpa") version libs.versions.kotlin
    id("com.palantir.docker") version "0.36.0"
    alias(libs.plugins.openapi)
}

apply(plugin = "io.spring.dependency-management")

group = "com.gum"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_21

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":indexer"))
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation(libs.bundles.hibernateSearch)
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.testcontainers:testcontainers")
    testImplementation("org.testcontainers:postgresql")
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.Embeddable")
    annotation("jakarta.persistence.MappedSuperclass")
}

tasks.withType<KotlinCompile> {
    dependsOn("openApiGenerate")
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "21"
    }
}

kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("${project.layout.buildDirectory.get()}/generated/src/main/kotlin")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

openApiMeta {
    packageName.set("com.gum.pmanager.api")
    outputFolder.set("${project.layout.buildDirectory.get()}/meta")
}

openApiGenerate {
    generatorName.set("kotlin-spring")
    inputSpec.set("${rootDir}/swagger-lib/video-api.yaml")
    outputDir.set("${project.layout.buildDirectory.get()}/generated")
    apiPackage.set("com.gum.pmanager.api")
    modelPackage.set("com.gum.pmanager.model")
    globalProperties.set(mapOf(
        "models" to "",
        "apis" to "",
        "invoker" to "false"
    ))
    configOptions.set(mapOf(
        "dateLibrary" to "java8",
        "interfaceOnly" to "true",
        "documentationProvider" to "none",
        "useSpringBoot3" to "true"
    ))
}

tasks.named<BootJar>("bootJar") {
    layered {
        enabled.set(true)
    }
}

tasks.create<Exec>("dockerStartPostgres") {
    commandLine("docker", "run", "-d", "--name", "pm-pgsql", "-p", "5432:5432", "-e", "POSTGRES_PASSWORD=postgres", "postgres")
}

tasks.create<Exec>("dockerStartPostgresProd") {
    workingDir("$rootDir/docker/postgres")
    commandLine("docker-compose", "-f", "docker-compose.yml", "up", "-d")
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

tasks.create<Exec>("dockerStopPostgresProd") {
    workingDir("$rootDir/docker/postgres")
    commandLine("docker-compose", "-f", "docker-compose.yml", "down")
}

docker {
    setName("pmanager")
    tag("local", "latest")
    setDockerfile(File("$rootDir/api/Dockerfile"))
    files(tasks.findByName("bootJar") ?: "${tasks["bootJar"].outputs}")
}
