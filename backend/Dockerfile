FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Install Maven and cache dependencies
COPY pom.xml .
RUN apk add --no-cache maven && \
    mvn dependency:go-offline -B 2>/dev/null || true

# Build application
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Production image ──
FROM eclipse-temurin:17-jre-alpine

RUN addgroup -S markai && adduser -S markai -G markai

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
RUN chown -R markai:markai /app

USER markai

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
