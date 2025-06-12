package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class InicioController {

    @GetMapping({"/", "/index.html"})
    public String index(HttpSession session) {
        return "index";
    }
    // En tu controlador, por ejemplo UsuarioController
    @ModelAttribute("esAdmin")
    public boolean agregarEsAdmin(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        return usuario != null && "admin".equalsIgnoreCase(usuario.getTipoCuenta());
    }

}

