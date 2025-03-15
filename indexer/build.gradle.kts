import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

@Suppress("DSL_SCOPE_VIOLATION") // TODO: Remove once KTIJ-19369 is fixed
plugins {
    alias(libs.plugins.springboot)
    kotlin("jvm")
    kotlin("plugin.spring") version libs.versions.kotlin
    kotlin("plugin.allopen") version libs.versions.kotlin
    kotlin("plugin.jpa") version libs.versions.kotlin
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
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    implementation("com.drewnoakes:metadata-extractor:2.18.0")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

allOpen {
    annotation("javax.persistence.Entity")
    annotation("javax.persistence.Embeddable")
    annotation("javax.persistence.MappedSuperclass")
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
    generatorName.set("kotlin")
    inputSpec.set("${rootDir}/swagger-lib/video-api.yaml")
    outputDir.set("${project.layout.buildDirectory.get()}/generated")

    configOptions.set(mapOf(
        "library" to "jvm-okhttp4",
        "dateLibrary" to "java8",
        "sourceFolder" to "src/main/kotlin",
        "serializationLibrary" to "jackson",
        "documentationProvider" to "none"
    ))
}
