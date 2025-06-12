package com.pgm.plataformapgm.config;

import com.pgm.plataformapgm.interceptor.SesionInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.dir}")  // Carpeta relativa, por ejemplo "uploads"
    private String uploadDir;

    private String absoluteUploadPath;

    @PostConstruct
    public void init() {
        // Obtener ruta absoluta a partir de la relativa
        Path path = Paths.get(uploadDir).toAbsolutePath();
        absoluteUploadPath = path.toString();

        // Crear carpeta si no existe
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                throw new RuntimeException("No se pudo crear la carpeta de uploads: " + absoluteUploadPath, e);
            }
        }
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SesionInterceptor())
                .addPathPatterns("/**")  // intercepta todas las rutas
                .excludePathPatterns(
                        "/css/**",
                        "/js/**",
                        "/img/**",
                        "/index.html",
                        "swagger-ui.html",
                        "modal.html",
                        "/login.html",
                        "/uploads/**",
                        "/register.html",
                        "/anuncios.html",
                        "/register",
                        "/login",
                        "/upload",
                        "/categorias",
                        "/solicitar"
                );
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeamos /uploads/** a la carpeta física con ruta absoluta
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absoluteUploadPath + "/");
    }
}
