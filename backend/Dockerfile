# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies separately from source changes.
# Render's shared build IPs are sometimes rate-limited (HTTP 429) by Maven Central,
# so retry transient download failures at both the Maven and transport layers.
COPY pom.xml .
RUN mvn -B -q -Dmaven.wagon.http.retryHandler.count=10 \
      -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 \
      -Dmaven.wagon.rto=30000 \
      -Dhttp.keepAlive=true dependency:go-offline || true

COPY src ./src
RUN mvn -B -q -Dmaven.wagon.http.retryHandler.count=10 \
      -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 \
      -Dmaven.wagon.rto=30000 \
      -Dhttp.keepAlive=true clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

USER app
EXPOSE 8080

# Render injects PORT (default 10000); application.yml reads ${PORT:8080}.
# Keep the heap inside the 512 MB free plan.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC"

ENTRYPOINT ["java", "-jar", "app.jar"]
