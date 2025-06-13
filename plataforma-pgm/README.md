# Plataforma-PGM (PGM)

Proyecto desarrollado con **Java 17** y **Spring Boot 3.4.4** que implementa una plataforma de gestión de anuncios. Este documento recoge las tecnologías usadas, dependencias, configuración Docker, propiedades de Spring Boot y descripción de las clases principales del proyecto.

---

## Tecnologías y versiones

| Tecnología         | Versión                                               |
|--------------------|------------------------------------------------------|
| Java               | 17 (OpenJDK 17)                                      |
| Spring Boot        | 3.4.4                                                |
| Maven              | 3.9.9                                                |
| PostgreSQL         | 15                                                   |
| Docker base images  | maven:3.9.9-eclipse-temurin-17 / openjdk:17-jdk-slim |
| Spring Security    | 6.4.4 (crypto)                                       |
| OpenAPI (springdoc)| 2.5.0                                                |
| Cloudinary         | 1.36.0                                               |

---

## Dependencias principales (`pom.xml`)

- **Spring Boot Starters** para Web, Data JPA, Thymeleaf, Mail, Actuator y Testing.
- Driver PostgreSQL para conexión a base de datos.
- Spring Security Crypto para cifrado.
- Biblioteca Thumbnailator para manipulación de imágenes.
- Cloudinary para almacenamiento y gestión de imágenes en la nube.
- Springdoc OpenAPI para documentación automática de la API.

---

## Configuración Docker

### `docker-compose.yml`

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/pgm_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: pgm_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgm_data:/var/lib/postgresql/data
volumes:
  pgm_data:
```

## Configuración application.properties

### `application.properties`

