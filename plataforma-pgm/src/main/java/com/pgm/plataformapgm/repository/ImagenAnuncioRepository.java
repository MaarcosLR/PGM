package com.pgm.plataformapgm.repository;

import com.pgm.plataformapgm.model.ImagenAnuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagenAnuncioRepository extends JpaRepository<ImagenAnuncio, Integer> {

}