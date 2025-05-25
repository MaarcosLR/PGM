package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.RegistroUsuarioDTO;
import com.pgm.plataformapgm.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class RegistroController {

    @Autowired
    private UsuarioService usuarioService;

    // Mostrar el formulario de registro
    @GetMapping("/register.html")
    public String mostrarFormulario(Model model) {
        model.addAttribute("registroUsuarioDTO", new RegistroUsuarioDTO());
        return "register.html"; // nombre de la plantilla Thymeleaf
    }

    // Procesar el formulario
    @PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<?> procesarRegistroJSON(@RequestBody RegistroUsuarioDTO dto) {
        try {
            usuarioService.registrarUsuario(dto);
            return ResponseEntity.ok(Map.of("message", "Usuario registrado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }


}

