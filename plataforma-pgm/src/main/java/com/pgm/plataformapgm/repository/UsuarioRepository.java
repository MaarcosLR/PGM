package com.pgm.plataformapgm.repository;

import com.pgm.plataformapgm.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreoElectronico(String correoElectronico);
}

