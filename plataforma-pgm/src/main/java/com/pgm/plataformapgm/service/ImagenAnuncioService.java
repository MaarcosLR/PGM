package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.model.ImagenAnuncio;
import com.pgm.plataformapgm.repository.ImagenAnuncioRepository;
import org.springframework.stereotype.Service;

@Service
public class ImagenAnuncioService {

    private final ImagenAnuncioRepository imagenAnuncioRepository;

    public ImagenAnuncioService(ImagenAnuncioRepository imagenAnuncioRepository) {
        this.imagenAnuncioRepository = imagenAnuncioRepository;
    }

    public void save(ImagenAnuncio imagenAnuncio) {
        imagenAnuncioRepository.save(imagenAnuncio);
    }

}