package com.pgm.plataformapgm.repository;

import com.pgm.plataformapgm.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}