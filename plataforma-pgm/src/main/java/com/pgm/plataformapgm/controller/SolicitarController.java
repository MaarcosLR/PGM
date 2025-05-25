package com.pgm.plataformapgm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SolicitarController {
    @GetMapping("/solicitar.html")
    public String anuncios() {
        return "solicitar";
    }
}