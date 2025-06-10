package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.DTO.LoginUsuarioDTO;
import com.pgm.plataformapgm.DTO.RegistroUsuarioDTO;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public void registrarUsuario(RegistroUsuarioDTO dto) {
        if (usuarioRepository.findByCorreoElectronico(dto.getCorreoElectronico()).isPresent()) {
            throw new RuntimeException("Correo ya registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        usuario.setTipoCuenta("usuario");
        usuario.setFechaRegistro(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

    public Usuario autenticarUsuario(LoginUsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findByCorreoElectronico(dto.getCorreoElectronico())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getContrasena(), usuario.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        return usuario;
    }

    public Usuario findById(Integer id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        return usuarioOpt.orElse(null);
    }

    public void save(Usuario usuarioSesion) {
        usuarioRepository.save(usuarioSesion);
    }
}
