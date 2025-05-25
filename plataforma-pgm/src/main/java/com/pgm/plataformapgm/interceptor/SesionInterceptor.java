package com.pgm.plataformapgm.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class SesionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        HttpSession session = request.getSession(false);
        String uri = request.getRequestURI();

        // Permitir acceso a recursos estáticos (css, js, imágenes)
        if (uri.startsWith("/css/") || uri.startsWith("/js/") || uri.startsWith("/img/")) {
            return true;
        }

        // Permitir acceso a index, login y register
        if (uri.equals("/") || uri.equals("/index.html") || uri.equals("/login.html") || uri.equals("/register.html")) {
            return true;
        }

        // Si hay sesión con usuario logueado, permite todo
        if (session != null && session.getAttribute("usuarioLogueado") != null) {
            return true;
        }

        // Si no cumple nada de lo anterior, redirige a login
        response.sendRedirect("/login.html");
        return false; // Bloquear la ejecución del controlador
    }
}

