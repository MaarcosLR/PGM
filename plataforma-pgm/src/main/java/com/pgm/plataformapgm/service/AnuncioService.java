package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.repository.AnuncioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnuncioService {

    @Autowired
    private AnuncioRepository anuncioRepository;

    public List<Anuncio> findByUsuarioAndEstado(Usuario usuario, String estado) {
        return anuncioRepository.findByUsuarioAndEstado(usuario, estado);
    }
}