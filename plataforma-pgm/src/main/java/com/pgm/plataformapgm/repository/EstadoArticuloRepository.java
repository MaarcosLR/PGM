package com.pgm.plataformapgm.repository;

import com.pgm.plataformapgm.model.EstadoArticulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoArticuloRepository extends JpaRepository<EstadoArticulo, Integer> {
}
