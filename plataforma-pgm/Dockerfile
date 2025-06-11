# Usa una imagen base de Java
FROM openjdk:17-jdk-slim

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo JAR generado al contenedor
COPY plataforma-pgm/targettarget/plataforma-pgm-0.0.1-SNAPSHOT.jar app.jar

# Expón el puerto en el que corre Spring Boot (por defecto 8080)
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
