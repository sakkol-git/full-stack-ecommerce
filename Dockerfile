# =============================================================================
# Stage 1 - Build the application
# =============================================================================
# FIX 3: Replaced massive 'maven' image with a lightweight JDK image since we use the wrapper
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and configuration first
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Ensure the wrapper has execution permissions (sometimes lost in Git for Windows)
RUN chmod +x ./mvnw

# Download dependencies (caching layer)
RUN ./mvnw dependency:go-offline

# Copy application source
COPY src ./src

# Build executable JAR
RUN ./mvnw clean package -DskipTests

# Extract Spring Boot layers
RUN java -Djarmode=layertools -jar target/*.jar extract

# =============================================================================
# Stage 2 - Runtime Image
# =============================================================================
# Optimization: Using Alpine JRE for a significantly smaller and more secure runtime
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="your-email@example.com"
LABEL org.opencontainers.image.title="Spring Boot Application"
LABEL org.opencontainers.image.description="Production-ready Spring Boot application"
LABEL org.opencontainers.image.version="1.0"

WORKDIR /app

# Create non-root user (Alpine uses addgroup/adduser instead of groupadd/useradd)
RUN addgroup --system spring && \
    adduser --system --ingroup spring spring

# FIX 2: Use --chown directly in the COPY command to prevent OverlayFS layer bloat
COPY --chown=spring:spring --from=builder /build/dependencies/ ./
COPY --chown=spring:spring --from=builder /build/spring-boot-loader/ ./
COPY --chown=spring:spring --from=builder /build/snapshot-dependencies/ ./
COPY --chown=spring:spring --from=builder /build/application/ ./

USER spring

EXPOSE 8080

# FIX 1: Modern JVM tuning strategy.
# Spring Boot automatically picks up JDK_JAVA_OPTIONS from the environment.
ENV JDK_JAVA_OPTIONS="-XX:+UseZGC -XshowSettings:system"

# FIX 1 (Continued): Use the strict JSON array format so Java becomes PID 1.
# This ensures SIGTERM is received and Spring Boot's Graceful Shutdown triggers.
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]