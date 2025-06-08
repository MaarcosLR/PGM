package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Notificacion;
import com.pgm.plataformapgm.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
