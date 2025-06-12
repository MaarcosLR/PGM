package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Notificacion;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.service.NotificacionService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Notificacion>> obtenerPorUsuario(@PathVariable Integer id) {
        List<Notificacion> notificaciones = notificacionService.obtenerPorUsuario(id);
        return ResponseEntity.ok(notificaciones);
    }

    @PostMapping("/{id}/leer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> marcarComoLeida(@PathVariable Integer id) {
        Optional<Notificacion> optNotificacion = notificacionService.obtenerPorId(id);
        if (optNotificacion.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Notificacion notificacion = optNotificacion.get();
        notificacion.setLeida(true);
        notificacionService.guardar(notificacion);
        return ResponseEntity.noContent().build();
    }

    // En tu controlador, por ejemplo UsuarioController
    @ModelAttribute("esAdmin")
    public boolean agregarEsAdmin(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        return usuario != null && "admin".equalsIgnoreCase(usuario.getTipoCuenta());
    }

}
