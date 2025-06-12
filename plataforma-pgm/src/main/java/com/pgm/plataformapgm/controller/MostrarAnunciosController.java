package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.service.AnuncioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios")
public class MostrarAnunciosController {

    private final AnuncioService anuncioService;

    public MostrarAnunciosController(AnuncioService anuncioService) {
        this.anuncioService = anuncioService;
    }

    @GetMapping("/mostrarAnuncios")
    public List<Anuncio> listarAnuncios() {
        // Devuelve lista de anuncios como JSON
        return anuncioService.obtenerTodosLosAnunciosAprobados();
    }
}

