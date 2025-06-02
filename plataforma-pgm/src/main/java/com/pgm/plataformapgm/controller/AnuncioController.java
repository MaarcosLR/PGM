package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.Categoria;
import com.pgm.plataformapgm.service.AnuncioService;
import com.pgm.plataformapgm.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/anuncios.html")
    public String anuncios(
            @RequestParam(required = false) List<String> categoriaId,
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String orden,
            @RequestParam(required = false, defaultValue = "€") String moneda,
            Model model) {

        // Si viene "all" o está vacío, asignamos null para que la vista lo interprete como "Todas las categorías"
        if (categoriaId == null || categoriaId.isEmpty() || (categoriaId.size() == 1 && "all".equals(categoriaId.get(0)))) {
            categoriaId = null;
        }

        List<Anuncio> anuncios = anuncioService.buscarAnuncios(busqueda, categoriaId, orden, moneda);
        List<Categoria> categorias = categoriaService.findAll();

        model.addAttribute("anuncios", anuncios);
        model.addAttribute("categorias", categorias);
        model.addAttribute("categoriaSeleccionada", categoriaId);
        model.addAttribute("busqueda", busqueda);
        model.addAttribute("moneda", moneda);
        model.addAttribute("orden", orden);

        return "anuncios";
    }

    @GetMapping("/anuncio/{id}")
    public String detalleAnuncio(@PathVariable Long id, Model model) {
        Anuncio anuncio = anuncioService.buscarPorId(id);
        if (anuncio == null) {
            return "error/404";
        }
        model.addAttribute("anuncio", anuncio);
        return "detalle-anuncio";
    }

}
