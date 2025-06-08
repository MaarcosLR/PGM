package com.pgm.plataformapgm.DTO;

import com.pgm.plataformapgm.model.Anuncio;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnuncioDTO {

    private Integer id;
    private String titulo;
    private String descripcion;
    private String precioFormateado;
    private String ubicacion;
    private String imagenPrincipalUrl;

    public AnuncioDTO(Anuncio anuncio) {
        this.id = anuncio.getId();
        this.titulo = anuncio.getTitulo();
        this.descripcion = anuncio.getDescripcion();
        this.precioFormateado = anuncio.getPrecioFormateado();
        this.ubicacion = anuncio.getUbicacion();

        // Obtener la URL de la imagen principal (la primera en la lista)
        if (anuncio.getImagenes() != null && !anuncio.getImagenes().isEmpty()) {
            this.imagenPrincipalUrl = anuncio.getImagenes().get(0).getUrlImagen(); // Asumiendo que ImagenAnuncio tiene método getUrl()
        } else {
            this.imagenPrincipalUrl = "/images/default-anuncio.png"; // ruta a imagen por defecto si no tiene imagen
        }
    }

    public AnuncioDTO() {

    }
}
