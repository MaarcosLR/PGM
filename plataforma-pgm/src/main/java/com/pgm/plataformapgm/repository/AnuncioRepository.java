package com.pgm.plataformapgm.repository;

import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.ImagenAnuncio;
import com.pgm.plataformapgm.model.Usuario;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnuncioRepository extends JpaRepository<Anuncio, Integer> {
    List<Anuncio> findByUsuarioAndEstado(Usuario usuario, String estado);
    List<Anuncio> findByEstado(String estado);

    @Query("SELECT a FROM Anuncio a " +
            "WHERE (" +
            "LOWER(a.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
            "LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))" +
            ") " +
            "AND (:categoria IS NULL OR a.categoria.nombre = :categoria)")
    List<Anuncio> buscarPorFiltro(
            @Param("texto") String texto,
            @Param("categoria") String categoria,
            Sort sort);

    List<Anuncio> findByIdIn(List<String> ids);

    List<Anuncio> findByUsuarioIdAndEstadoOrderByFechaPublicacionDesc(Integer usuarioId, String estado);
}