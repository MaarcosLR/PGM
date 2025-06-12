package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SolicitarController {

    @GetMapping("/solicitar.html")
    public String mostrarFormulario(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");

        if (usuario == null) {
            return "redirect:/login.html";
        }

        if ("admin".equalsIgnoreCase(usuario.getTipoCuenta())) {
            return "redirect:/inicio.html"; // redirecciona si es admin
        }

        return "solicitar";
    }
}
