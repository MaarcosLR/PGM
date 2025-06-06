package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.EstadoArticulo;
import com.pgm.plataformapgm.service.EstadoArticuloService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/estado-articulo")
public class EstadoArticuloController {

    private final EstadoArticuloService estadoArticuloService;

    public EstadoArticuloController(EstadoArticuloService estadoArticuloService) {
        this.estadoArticuloService = estadoArticuloService;
    }

    @GetMapping
    public List<EstadoArticulo> listarEstados() {
        return estadoArticuloService.listarEstados();
    }
}
