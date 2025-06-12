package com.pgm.plataformapgm.config;

import com.pgm.plataformapgm.interceptor.SesionInterceptor;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SesionInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/css/**",
                        "/js/**",
                        "/img/**",
                        "/index.html",
                        "/swagger-ui/**",
                        "/v3/api-docs",
                        "/modal.html",
                        "/login.html",
                        "/register.html",
                        "/anuncios.html",
                        "/terminos.html",
                        "/register",
                        "/login",
                        "/upload",
                        "/categorias",
                        "/solicitar",
                        "/api/anuncios/mostrarAnuncios"
                );
    }
}
