# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies separately from source changes
COPY pom.xml .
RUN mvn -B -q dependency:go-offline || true

COPY src ./src
RUN mvn -B -q clean package -DskipTests

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
