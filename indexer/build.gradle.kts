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
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("com.squareup.okhttp3:okhttp:4.2.0")
    implementation("com.drewnoakes:metadata-extractor:2.16.0")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
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
        kotlin.srcDir("$buildDir/generate-resources/main/src/main/kotlin")
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
    generatorName.set("kotlin")
    inputSpec.set("${rootDir}/swagger-lib/video-api.yaml")

    configOptions.set(mapOf(
        "library" to "jvm-okhttp4",
        "dateLibrary" to "java8",
        "sourceFolder" to "src/main/kotlin",
        "serializationLibrary" to "jackson"
    ))
}
