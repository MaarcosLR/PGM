package com.pgm.plataformapgm.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pgm.plataformapgm.model.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioDTO {
    private String nombre;
    private String correoElectronico;
    private String telefono;
    private String pais;
    private String ciudad;
    private String fotoPerfil;

    public UsuarioDTO(Usuario usuario) {
        this.nombre = usuario.getNombre();
        this.correoElectronico = usuario.getCorreoElectronico();
        this.telefono = usuario.getTelefono();
        this.pais = usuario.getPais();
        this.ciudad = usuario.getCiudad();
        this.fotoPerfil = usuario.getFotoPerfil();
    }

}
