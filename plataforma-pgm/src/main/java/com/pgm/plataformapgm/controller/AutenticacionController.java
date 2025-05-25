package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.LoginUsuarioDTO;
import com.pgm.plataformapgm.DTO.RegistroUsuarioDTO;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AutenticacionController {

    private final UsuarioService usuarioService;

    public AutenticacionController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/login.html")
    public String mostrarLogin(Model model) {
        model.addAttribute("loginUsuarioDTO", new LoginUsuarioDTO());
        return "login"; // plantilla HTML para login
    }

    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<?> loginJson(@RequestBody LoginUsuarioDTO loginDto, HttpSession session) {
        try {
            Usuario usuario = usuarioService.autenticarUsuario(loginDto);
            session.setAttribute("usuarioLogueado", usuario);
            return ResponseEntity.ok().body(
                    java.util.Map.of("message", "Inicio de sesión correcto")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("message", e.getMessage())
            );
        }
    }


    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login.html";
    }

}

