package com.pgm.plataformapgm.config;

import com.pgm.plataformapgm.interceptor.SesionInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.dir}")  // Inyectamos la carpeta física
    private String uploadDir;

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
        // Aquí mapeamos la URL /uploads/** a la carpeta física en disco
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
