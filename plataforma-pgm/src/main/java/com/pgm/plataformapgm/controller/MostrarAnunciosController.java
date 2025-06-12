package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.AnuncioDTO;
import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.service.AnuncioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/buscar")
    public ResponseEntity<List<AnuncioDTO>> buscarAnuncios(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) List<String> categorias,
            @RequestParam(required = false) String orden,
            @RequestParam(required = false, defaultValue = "EUR") String moneda // Por defecto
    ) {
        List<Anuncio> anuncios = anuncioService.buscarAnuncios(busqueda, categorias, orden, moneda);
        List<AnuncioDTO> anunciosDTO = anuncios.stream().map(AnuncioDTO::new).toList();
        return ResponseEntity.ok(anunciosDTO);
    }

}

