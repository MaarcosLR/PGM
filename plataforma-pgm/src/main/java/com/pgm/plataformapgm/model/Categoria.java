package com.pgm.plataformapgm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String nombre;

    private String descripcion;

    private String icono;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    private List<Anuncio> anuncios;

}
