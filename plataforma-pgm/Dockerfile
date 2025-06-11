# Etapa 1: Build con Maven y JDK 17
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar solo los archivos necesarios para descargar dependencias
COPY plataforma-pgm/pom.xml .
COPY plataforma-pgm/src ./src

# Construir el JAR sin tests para acelerar
RUN mvn clean package -DskipTests

# Etapa 2: Imagen runtime más ligera con solo el JAR
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiar el JAR desde la etapa de build
COPY --from=build /app/target/plataforma-pgm-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
