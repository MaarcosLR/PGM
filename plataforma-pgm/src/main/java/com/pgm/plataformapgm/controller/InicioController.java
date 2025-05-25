package com.pgm.plataformapgm.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class InicioController {

    @GetMapping({"/", "/index.html"})
    public String index(HttpSession session) {
        return "index";
    }
}

