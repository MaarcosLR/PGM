package com.pgm.plataformapgm.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@Entity
@Table(name = "anuncios")
public class Anuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    private BigDecimal precio;

    private String ubicacion;

    private String estado;

    @Column(name = "fecha_publicacion")
    private LocalDateTime fechaPublicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonBackReference
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    @JsonBackReference
    private Categoria categoria;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "anuncio")
    @JsonManagedReference
    private List<ImagenAnuncio> imagenes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_articulo_id", nullable = false)  // FK en tabla anuncios
    @JsonIgnore
    private EstadoArticulo estadoArticulo;

    @Transient
    private String precioFormateado;

    public String getPrecioFormateado() {
        if (precio == null) {
            return null;
        }
        String moneda = "€"; // o si la moneda viene dinámica, adapta aquí
        if (precio.stripTrailingZeros().scale() <= 0) {
            // entero, sin decimales
            return String.format("%d %s", precio.intValue(), moneda);
        } else {
            // con decimales
            return String.format("%.2f %s", precio.doubleValue(), moneda);
        }
    }
}
