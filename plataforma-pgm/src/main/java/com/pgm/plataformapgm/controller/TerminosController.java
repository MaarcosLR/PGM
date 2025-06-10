package com.pgm.plataformapgm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TerminosController {

    @GetMapping("/terminos.html")
    public String terminos() {
        return "terminos";
    }
}
