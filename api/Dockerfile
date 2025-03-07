FROM bellsoft/liberica-runtime-container:jre-21-cds-slim-musl AS builder
WORKDIR /application
ARG JAR_FILE=*-SNAPSHOT.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM bellsoft/liberica-runtime-container:jre-21-cds-slim-musl
WORKDIR /application
RUN mkdir "index"
ENV SPRING_JPA_PROPERTIES_HIBERNATE_SEARCH_BACKEND_DIRECTORY_ROOT="/application/index"

COPY --from=builder application/dependencies/ ./
COPY --from=builder application/spring-boot-loader/ ./
COPY --from=builder application/snapshot-dependencies/ ./
COPY --from=builder application/application/ ./
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
