package com.pgm.plataformapgm.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ModalController {

    @GetMapping("/components/modal.html")
    public String showModal() {
        return "components/modal";
    }
}

