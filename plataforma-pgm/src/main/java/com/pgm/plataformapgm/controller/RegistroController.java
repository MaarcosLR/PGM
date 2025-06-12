package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.RegistroUsuarioDTO;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.service.EmailService;
import com.pgm.plataformapgm.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class RegistroController {

    private final UsuarioService usuarioService;
    private final EmailService emailService;

    public RegistroController(UsuarioService usuarioService, EmailService emailService) {
        this.usuarioService = usuarioService;
        this.emailService = emailService;
    }

    @GetMapping("/register.html")
    public String mostrarFormularioRegistro() {
        return "register";
    }

    @PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<?> procesarRegistroJSON(@RequestBody RegistroUsuarioDTO dto) {
        try {
            usuarioService.registrarUsuario(dto);

            // Enviar correo de confirmación
            emailService.enviarCorreoRegistroExitoso(dto.getCorreoElectronico(), dto.getNombre());

            return ResponseEntity.ok(Map.of("message", "Usuario registrado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    // En tu controlador, por ejemplo UsuarioController
    @ModelAttribute("esAdmin")
    public boolean agregarEsAdmin(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        return usuario != null && "admin".equalsIgnoreCase(usuario.getTipoCuenta());
    }

}


