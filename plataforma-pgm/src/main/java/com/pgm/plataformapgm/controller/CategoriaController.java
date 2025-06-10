package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Categoria;
import com.pgm.plataformapgm.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping("/categorias")
    @ResponseBody  // Esto es clave para devolver JSON, no vista
    public List<Categoria> getCategorias() {
        return categoriaService.findAll();
    }
}

