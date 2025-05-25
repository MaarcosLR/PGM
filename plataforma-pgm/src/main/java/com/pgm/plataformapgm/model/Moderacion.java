package com.pgm.plataformapgm.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "moderaciones")
public class Moderacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "anuncio_id", unique = true, nullable = false)
    private Anuncio anuncio;

    @Column(name = "estado_revision", nullable = false, length = 20)
    private String estadoRevision;

    @Column(columnDefinition = "TEXT")
    private String comentarios;

    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrador_id", nullable = false)
    private Usuario administrador;

}
