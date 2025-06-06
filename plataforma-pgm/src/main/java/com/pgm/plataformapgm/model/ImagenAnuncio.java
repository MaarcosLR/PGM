package com.pgm.plataformapgm.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "imagenes_anuncio")
public class ImagenAnuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anuncio_id", nullable = false)
    @JsonBackReference
    private Anuncio anuncio;

    @Column(name = "url_imagen", nullable = false, columnDefinition = "TEXT")
    private String urlImagen;

    private Integer orden = 1;

}
