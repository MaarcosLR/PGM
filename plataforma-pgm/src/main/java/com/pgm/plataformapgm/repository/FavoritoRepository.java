package com.pgm.plataformapgm.repository;

import com.pgm.plataformapgm.model.Favorito;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuario(Usuario usuario);

    Optional<Favorito> findByUsuarioAndAnuncio(Usuario usuario, Anuncio anuncio);

    void deleteByUsuarioAndAnuncio(Usuario usuario, Anuncio anuncio);

    boolean existsByUsuarioAndAnuncio(Usuario usuario, Anuncio anuncio);
}
