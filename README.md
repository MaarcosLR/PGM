# 📢 Plataforma-PGM (PGM)

Proyecto desarrollado con **Java 17** y **Spring Boot 3.4.4** que implementa una **plataforma de gestión de anuncios**.  
Este documento detalla las **tecnologías utilizadas**, **dependencias clave**, **configuración Docker**, **propiedades de Spring Boot** y una descripción de las **clases principales** del proyecto.

---

## 🚀 Tecnologías y versiones

| 🧩 Tecnología          | 📌 Versión                                               |
|------------------------|----------------------------------------------------------|
| **Java**               | 17 (OpenJDK 17)                                          |
| **Spring Boot**        | 3.4.4                                                    |
| **Maven**              | 3.9.9                                                    |
| **PostgreSQL**         | 15                                                       |
| **Docker base images** | `maven:3.9.9-eclipse-temurin-17` / `openjdk:17-jdk-slim` |
| **Spring Security**    | 6.4.4 (Crypto)                                           |
| **OpenAPI (springdoc)**| 2.5.0                                                    |
| **Cloudinary**         | 1.36.0                                                   |

---

## 📦 Dependencias principales (`pom.xml`)

- **Spring Boot Starters**:
    - `spring-boot-starter-web`
    - `spring-boot-starter-data-jpa`
    - `spring-boot-starter-thymeleaf`
    - `spring-boot-starter-mail`
    - `spring-boot-starter-actuator`
    - `spring-boot-starter-test`
- **PostgreSQL Driver**: Para la conexión con la base de datos.
- **Spring Security Crypto**: Para cifrado de contraseñas y datos sensibles.
- **Thumbnailator**: Biblioteca para manipulación y redimensionado de imágenes.
- **Cloudinary**: Servicio en la nube para almacenamiento y gestión de imágenes.
- **Springdoc OpenAPI**: Generación automática de documentación de la API.

---

✅ **Tip:** Mantén tu `pom.xml` limpio y actualizado para garantizar compatibilidad y seguridad.
---

## 🐳 Configuración Docker

El proyecto incluye soporte para **Docker** utilizando imágenes oficiales de **Maven** y **OpenJDK** para construir y ejecutar la aplicación en un contenedor.

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

## ⚙️ Configuración propiedades de Spring Boot

### `application.properties`

```application.properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/pgm_db}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:postgres}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

spring.thymeleaf.cache=false

server.port=8080

spring.mail.host=smtp.example.com
spring.mail.port=587
spring.mail.username=tu_email@example.com
spring.mail.password=tu_contraseña
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

cloudinary.cloud_name=tu_cloud_name
cloudinary.api_key=tu_api_key
cloudinary.api_secret=tu_api_secret

springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

💡 **Recomendación:**  
Para proteger credenciales sensibles como contraseñas de base de datos o claves de Cloudinary, **usa variables de entorno o un archivo `.env`**.  
De esta forma, evitarás exponer datos críticos en el repositorio.

Ejemplo de archivo `.env` (no lo subas a Git, añade `.env` a tu `.gitignore`):

```env
# Puerto del servidor
SERVER_PORT=8080

# Base de datos PostgreSQL
DB_URL=jdbc:postgresql://localhost:5432/pgm_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 📌 Funcionamiento de la Web

La estructura de la base de datos define las relaciones clave entre los distintos elementos del sistema y cómo interactúan entre sí:

### 👥 Usuarios
- Cada usuario puede **crear y gestionar múltiples anuncios**.
- Puede **recibir varias notificaciones** personalizadas.
- Puede **guardar anuncios como favoritos** para acceder rápidamente a ellos.

### 📢 Anuncios
- Cada anuncio pertenece a un **único usuario** que lo creó.
- Está asociado a una **categoría específica** y tiene un **estado** que indica su disponibilidad o condición (por ejemplo: activo, vendido, pendiente).
- Cada anuncio puede tener **varias imágenes** para mostrar diferentes vistas o detalles del producto o servicio ofrecido.

### ❤️ Favoritos
La relación entre usuarios y anuncios favoritos es **de muchos a muchos**:
- Un **usuario** puede marcar como favoritos **varios anuncios**.
- Un **anuncio** puede ser marcado como favorito por **varios usuarios**.

---

Esta estructura permite a la plataforma:
- Gestionar de forma eficiente los anuncios publicados.
- Facilitar la navegación y búsqueda por **categorías** y **estados**.
- Ofrecer funcionalidades sociales como guardar favoritos y recibir **notificaciones personalizadas**.

---

### 📌 **Clases principales**

- **Controladores REST:**
    - `UsuarioController`: Gestiona operaciones relacionadas con usuarios.
    - `AnuncioController`: Gestiona la creación, consulta y actualización de anuncios.
    - `NotificacionController`: Maneja el envío y la consulta de notificaciones.

- **Servicios (Lógica de negocio):**
    - `UsuarioService`: Contiene la lógica principal para operaciones de usuarios.
    - `AnuncioService`: Contiene la lógica principal para operaciones de anuncios.

- **Entidades:**
    - `Usuario`, `Anuncio`, `Categoria`, `Estado`, `Favorito`, `Notificacion`.

- **Repositorios:**  
  Interfaces que extienden `JpaRepository` para operaciones CRUD de forma sencilla y eficiente.

- **Configuraciones:**  
  Clases de configuración para Seguridad, CORS, integración con **Cloudinary**, etc.

---

## 📄 **Licencia**

Este proyecto es de uso **educativo y demostrativo**.  
Eres libre de adaptarlo y mejorarlo según tus necesidades. 🚀

---

## 🤝 **Contacto**

Para dudas, sugerencias o contribuciones:
- Abre un **Issue** o envía un **Pull Request** en este repositorio.
- O contáctanos directamente por correo: **infopgm2025@gmail.com**

