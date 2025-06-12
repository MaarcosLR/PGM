package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.AnuncioDTO;
import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.service.AnuncioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios")
public class MostrarAnunciosController {

    private final AnuncioService anuncioService;

    public MostrarAnunciosController(AnuncioService anuncioService) {
        this.anuncioService = anuncioService;
    }

    @GetMapping("/mostrarAnuncios")
    public List<AnuncioDTO> listarAnuncios(
            @RequestParam(value = "busqueda", required = false) String busqueda,
            @RequestParam(value = "categoriaId", required = false) List<String> categoriaIds,
            @RequestParam(value = "orden", required = false) String orden,
            @RequestParam(value = "moneda", required = false, defaultValue = "EUR") String moneda
    ) {
        if (categoriaIds == null || categoriaIds.isEmpty()) {
            categoriaIds = List.of("all");
        }

        List<Anuncio> anuncios = anuncioService.buscarAnuncios(busqueda, categoriaIds, orden, moneda);

        // ⚠️ Convertir a DTOs y forzar carga de imágenes antes de cerrar sesión
        return anuncios.stream()
                .map(anuncio -> {
                    // Forzar la carga de las imágenes (evita problemas con LAZY)
                    anuncio.getImagenes().size();
                    return new AnuncioDTO(anuncio);
                })
                .toList();
    }

    // En tu controlador, por ejemplo UsuarioController
    @ModelAttribute("esAdmin")
    public boolean agregarEsAdmin(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        return usuario != null && "admin".equalsIgnoreCase(usuario.getTipoCuenta());
    }

}