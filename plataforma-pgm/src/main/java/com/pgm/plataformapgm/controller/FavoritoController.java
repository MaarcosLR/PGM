package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.AnuncioDTO;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.service.FavoritoService;
import com.pgm.plataformapgm.service.AnuncioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;
    private final AnuncioService anuncioService;

    public FavoritoController(FavoritoService favoritoService, AnuncioService anuncioService) {
        this.favoritoService = favoritoService;
        this.anuncioService = anuncioService;
    }

    @PostMapping("/{anuncioId}")
    public ResponseEntity<?> addFavorito(@PathVariable Integer anuncioId, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            return ResponseEntity.status(401).body("No autorizado");
        }
        favoritoService.addFavorito(usuario.getId(), anuncioId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{anuncioId}")
    public ResponseEntity<?> removeFavorito(@PathVariable Integer anuncioId, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            return ResponseEntity.status(401).body("No autorizado");
        }
        favoritoService.removeFavorito(usuario.getId(), anuncioId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<AnuncioDTO>> getFavoritos(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }
        List<AnuncioDTO> favoritos = favoritoService.getFavoritos(usuario.getId());
        return ResponseEntity.ok(favoritos);
    }

    @GetMapping("/{anuncioId}/esFavorito")
    public ResponseEntity<Boolean> esFavorito(@PathVariable Integer anuncioId, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }
        boolean favorito = favoritoService.esFavorito(usuario.getId(), anuncioId);
        return ResponseEntity.ok(favorito);
    }

}
