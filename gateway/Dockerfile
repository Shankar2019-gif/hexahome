# ==============================================================================
# HexaHome API Gateway Dockerfile - Multi-Stage Production Build
# Framework: Spring Boot 3.3.4 + Spring Cloud Gateway (Java 17)
# ==============================================================================

# Stage 1: Build & Package
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Optimize Docker layer caching for Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Install curl for container health checks
RUN apk add --no-cache curl

# Create non-privileged system user and group for security
RUN addgroup -S hexahome && adduser -S hexahome -G hexahome

# Copy compiled JAR from builder stage
COPY --from=builder --chown=hexahome:hexahome /build/target/*.jar /app/app.jar

USER hexahome

# Expose Spring Cloud Gateway server port
EXPOSE 8080

# Health check against Spring Boot Actuator Health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Container-optimized JVM execution flags
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "/app/app.jar"]
