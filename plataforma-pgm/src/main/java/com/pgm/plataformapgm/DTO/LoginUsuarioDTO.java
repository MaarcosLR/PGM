package com.pgm.plataformapgm.DTO;

import com.pgm.plataformapgm.model.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginUsuarioDTO {

    private String username;
    private String correoElectronico;
    private String contrasena;

}
