package com.pgm.plataformapgm.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistroUsuarioDTO {

    private String nombre;
    private String correoElectronico;
    private String contrasena;
    private String tipoCuenta;

}
