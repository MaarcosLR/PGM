package com.pgm.plataformapgm.config;

import com.pgm.plataformapgm.interceptor.SesionInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SesionInterceptor())
                .addPathPatterns("/**")  // intercepta todas las rutas
                .excludePathPatterns(
                        "/css/**",
                        "/js/**",
                        "/img/**",
                        "/index.html",
                        "/login.html",
                        "/register.html",
                        "/register",
                        "/login"
                );  // aquí también excluyes recursos públicos
    }
}
