package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.DTO.AnuncioDTO;
import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.Favorito;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.repository.FavoritoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final AnuncioService anuncioService;

    public FavoritoService(FavoritoRepository favoritoRepository, AnuncioService anuncioService) {
        this.favoritoRepository = favoritoRepository;
        this.anuncioService = anuncioService;
    }

    @Transactional
    public void addFavorito(Integer usuarioId, Integer anuncioId) {
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);

        Anuncio anuncio = anuncioService.findById(anuncioId);

        if (!favoritoRepository.existsByUsuarioAndAnuncio(usuario, anuncio)) {
            Favorito favorito = new Favorito(usuario, anuncio);
            favoritoRepository.save(favorito);
        }
    }

    @Transactional
    public void removeFavorito(Integer usuarioId, Integer anuncioId) {
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);

        Anuncio anuncio = anuncioService.findById(anuncioId);
        favoritoRepository.deleteByUsuarioAndAnuncio(usuario, anuncio);
    }

    public boolean esFavorito(Integer usuarioId, Integer anuncioId) {
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);

        Anuncio anuncio = anuncioService.findById(anuncioId);
        return favoritoRepository.existsByUsuarioAndAnuncio(usuario, anuncio);
    }

    public List<AnuncioDTO> getFavoritos(Integer usuarioId) {
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);

        List<Favorito> favoritos = favoritoRepository.findByUsuario(usuario);

        return favoritos.stream()
                .map(f -> anuncioService.toDTO(f.getAnuncio()))
                .collect(Collectors.toList());
    }
}
