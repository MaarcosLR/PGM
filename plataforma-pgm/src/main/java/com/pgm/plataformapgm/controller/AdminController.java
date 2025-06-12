package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

public class AdminController {

    @GetMapping("/api/usuario/info")
    @ResponseBody
    public ResponseEntity<?> obtenerUsuario(HttpSession session) {
        Object usuario = session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }
        Usuario u = (Usuario) usuario;
        return ResponseEntity.ok(Map.of(
                "nombre", u.getNombre(),
                "correo", u.getCorreoElectronico(),
                "tipoCuenta", u.getTipoCuenta()
        ));
    }

}
