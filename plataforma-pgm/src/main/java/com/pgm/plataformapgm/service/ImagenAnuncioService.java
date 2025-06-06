package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.model.ImagenAnuncio;
import com.pgm.plataformapgm.repository.ImagenAnuncioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagenAnuncioService {

    @Autowired
    private ImagenAnuncioRepository imagenAnuncioRepository;

    public void save(ImagenAnuncio imagenAnuncio) {
        imagenAnuncioRepository.save(imagenAnuncio);
    }

}