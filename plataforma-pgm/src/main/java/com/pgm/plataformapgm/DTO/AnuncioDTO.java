package com.pgm.plataformapgm.DTO;

import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.EstadoArticulo;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnuncioDTO {

    private Integer id;
    private String titulo;
    private String descripcion;
    private String precioFormateado;
    private String estadoArticuloNombre;
    private String ubicacion;
    private String imagenPrincipalUrl;
    
    public AnuncioDTO(Anuncio anuncio) {
        this.id = anuncio.getId();
        this.titulo = anuncio.getTitulo();
        this.descripcion = anuncio.getDescripcion();
        this.ubicacion = anuncio.getUbicacion();
        this.precioFormateado = anuncio.getPrecioFormateado();

        if (anuncio.getImagenes() != null && !anuncio.getImagenes().isEmpty()) {
            this.imagenPrincipalUrl = anuncio.getImagenes().get(0).getUrlImagen();
        }

        // Aquí está la clave:
        if (anuncio.getEstadoArticulo() != null) {
            this.estadoArticuloNombre = anuncio.getEstadoArticulo().getNombre();
        }
    }


    public AnuncioDTO() {

    }
}
