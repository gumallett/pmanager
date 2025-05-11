FROM bellsoft/liberica-runtime-container:jre-21-cds-slim-musl AS builder
WORKDIR /app
ARG JAR_FILE="api-0.0.1-SNAPSHOT.jar"
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=tools -jar application.jar extract --layers --launcher --destination extracted

FROM bellsoft/liberica-runtime-container:jre-21-cds-slim-musl
WORKDIR /app
RUN mkdir "index"
ENV SPRING_JPA_PROPERTIES_HIBERNATE_SEARCH_BACKEND_DIRECTORY_ROOT="/app/index"

COPY --from=builder /app/extracted/dependencies/ ./
COPY --from=builder /app/extracted/spring-boot-loader/ ./
COPY --from=builder /app/extracted/application/ ./
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
