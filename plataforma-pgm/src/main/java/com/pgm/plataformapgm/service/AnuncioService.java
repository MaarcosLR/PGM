package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.DTO.AnuncioDTO;
import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.repository.AnuncioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnuncioService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private AnuncioRepository anuncioRepository;

    public List<Anuncio> findByUsuarioAndEstado(Usuario usuario, String estado) {
        return anuncioRepository.findByUsuarioAndEstado(usuario, estado);
    }

    public List<Anuncio> findByEstado(String estado) {
        return anuncioRepository.findByEstado(estado);
    }





    public List<Anuncio> buscarAnuncios(String texto, List<String> categorias, String orden, String moneda) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Anuncio> query = cb.createQuery(Anuncio.class);
        Root<Anuncio> anuncio = query.from(Anuncio.class);

        List<Predicate> predicates = new ArrayList<>();

        if (texto != null && !texto.trim().isEmpty()) {
            String likeTexto = "%" + texto.toLowerCase() + "%";
            Predicate tituloPredicate = cb.like(cb.lower(anuncio.get("titulo")), likeTexto);
            Predicate descripcionPredicate = cb.like(cb.lower(anuncio.get("descripcion")), likeTexto);
            predicates.add(cb.or(tituloPredicate, descripcionPredicate));
        }

        if (categorias != null && !categorias.isEmpty() && !(categorias.size() == 1 && categorias.get(0).equals("all"))) {
            // Aquí filtro para que categoria.nombre esté en la lista de categorias seleccionadas
            predicates.add(anuncio.get("categoria").get("id").in(categorias.stream().map(Long::valueOf).toList()));
        }

        // Filtrar solo anuncios con estado 'aprobado'
        predicates.add(cb.equal(anuncio.get("estado"), "aprobado"));

        query.where(predicates.toArray(new Predicate[0]));

        if (orden != null && !orden.trim().isEmpty()) {
            switch (orden.toLowerCase()) {
                case "titulo_asc":
                    query.orderBy(cb.asc(anuncio.get("titulo")));
                    break;
                case "titulo_desc":
                    query.orderBy(cb.desc(anuncio.get("titulo")));
                    break;
                case "precio_desc":
                    query.orderBy(cb.desc(anuncio.get("precio")));
                    break;
                case "precio_asc":
                    query.orderBy(cb.asc(anuncio.get("precio")));
                    break;
                default:
                    query.orderBy(cb.desc(anuncio.get("fechaPublicacion")));
                    break;
            }
        } else {
            query.orderBy(cb.desc(anuncio.get("fechaPublicacion")));
        }

        List<Anuncio> anuncios = entityManager.createQuery(query).getResultList();

        for (Anuncio a : anuncios) {
            a.setPrecioFormateado(formatearPrecio(a.getPrecio(), moneda));
        }

        return anuncios;
    }


    // Método para cargar todos
    public List<Anuncio> findAll() {
        return anuncioRepository.findAll();
    }

    public Anuncio buscarPorId(Integer id) {
        return anuncioRepository.findById(id).orElse(null);
    }

    public String formatearPrecio(BigDecimal precio, String moneda) {
        if (precio == null) {
            return "Sin precio";
        }
        DecimalFormat df;

        // Comprobar si tiene decimales (parte decimal > 0)
        if (precio.stripTrailingZeros().scale() <= 0) {
            df = new DecimalFormat("#");
        } else {
            df = new DecimalFormat("#.##");
        }

        return df.format(precio) + " " + moneda;
    }

    public Anuncio findById(Integer id) {
        return anuncioRepository.findById(id).orElse(null);
    }

    public void save(Anuncio anuncio) {
        anuncioRepository.save(anuncio);
    }

    public List<Anuncio> buscarPorIds(List<String> favoritosIds) {
        if (favoritosIds == null || favoritosIds.isEmpty()) {
            return List.of(); // Devuelve lista vacía si no hay IDs
        }
        return anuncioRepository.findByIdIn(favoritosIds);
    }

    public AnuncioDTO toDTO(Anuncio anuncio) {
        AnuncioDTO dto = new AnuncioDTO();
        dto.setId(anuncio.getId());
        dto.setTitulo(anuncio.getTitulo());
        dto.setPrecioFormateado(anuncio.getPrecioFormateado());
        dto.setDescripcion(anuncio.getDescripcion());
        dto.setUbicacion(anuncio.getUbicacion());
        dto.setImagenPrincipalUrl(anuncio.getImagenes().get(0).getUrlImagen());
        return dto;
    }

    public List<Anuncio> obtenerAprobadosPorUsuario(Integer usuarioId) {
        return anuncioRepository.findByUsuarioIdAndEstadoOrderByFechaPublicacionDesc(usuarioId, "aprobado");
    }

}