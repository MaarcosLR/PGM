package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.model.EstadoArticulo;
import com.pgm.plataformapgm.repository.EstadoArticuloRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;


@Service
public class EstadoArticuloService {

    private final EstadoArticuloRepository estadoArticuloRepository;

    public EstadoArticuloService(EstadoArticuloRepository estadoArticuloRepository) {
        this.estadoArticuloRepository = estadoArticuloRepository;
    }

    public List<EstadoArticulo> listarEstados() {
        return estadoArticuloRepository.findAll();
    }

    public Optional<EstadoArticulo> findById(Integer id) {
        return estadoArticuloRepository.findById(id);
    }

}
