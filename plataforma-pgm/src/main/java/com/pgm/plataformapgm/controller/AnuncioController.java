package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.AnuncioDTO;
import com.pgm.plataformapgm.model.*;
import com.pgm.plataformapgm.service.*;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Controller
public class AnuncioController {

    private final AnuncioService anuncioService;
    private final EstadoArticuloService estadoArticuloService;
    private final NotificacionService notificacionService;
    private final EmailService emailService;
    private final CategoriaService categoriaService;
    private final ImagenAnuncioService imagenAnuncioService;
    private final CloudinaryService cloudinaryService;

    public AnuncioController(
            AnuncioService anuncioService,
            EstadoArticuloService estadoArticuloService,
            NotificacionService notificacionService,
            EmailService emailService,
            CategoriaService categoriaService,
            ImagenAnuncioService imagenAnuncioService,
            CloudinaryService cloudinaryService) {
        this.anuncioService = anuncioService;
        this.estadoArticuloService = estadoArticuloService;
        this.notificacionService = notificacionService;
        this.emailService = emailService;
        this.categoriaService = categoriaService;
        this.imagenAnuncioService = imagenAnuncioService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/anuncios.html")
    public String anuncios(
            @RequestParam(required = false) List<String> categoriaId,
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String orden,
            @RequestParam(required = false, defaultValue = "€") String moneda,
            Model model) {

        if (categoriaId == null || categoriaId.isEmpty() || (categoriaId.size() == 1 && "all".equals(categoriaId.get(0)))) {
            categoriaId = null;
        }

        List<Anuncio> anuncios = anuncioService.buscarAnuncios(busqueda, categoriaId, orden, moneda);
        List<Categoria> categorias = categoriaService.findAll();

        model.addAttribute("anuncios", anuncios);
        model.addAttribute("categorias", categorias);
        model.addAttribute("categoriaSeleccionada", categoriaId);
        model.addAttribute("busqueda", busqueda);
        model.addAttribute("moneda", moneda);
        model.addAttribute("orden", orden);

        return "anuncios";
    }

    @GetMapping("/anuncio/{id}")
    public String detalleAnuncio(@PathVariable Integer id, Model model) {
        Anuncio anuncio = anuncioService.buscarPorId(id);
        if (anuncio == null) {
            return "error/404";
        }
        model.addAttribute("anuncio", anuncio);
        return "detalle-anuncio";
    }

    @PostMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobar(@PathVariable Integer id) {
        Anuncio anuncio = anuncioService.findById(id);
        if (anuncio == null) return ResponseEntity.notFound().build();

        anuncio.setEstado("aprobado");
        anuncioService.save(anuncio);

        Usuario usuario = anuncio.getUsuario();
        emailService.enviarCorreo(usuario.getCorreoElectronico(),
                "Anuncio aprobado",
                "Hola " + usuario.getNombre() + ", tu anuncio ha sido aprobado.");

        String contenido = "Tu anuncio <strong>" + anuncio.getTitulo() + "</strong> fue aprobado.";
        notificacionService.crear(contenido, "APROBACION", usuario);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazar(@PathVariable Integer id, @RequestBody Map<String, String> datos) {
        Anuncio anuncio = anuncioService.findById(id);
        if (anuncio == null) return ResponseEntity.notFound().build();

        String motivo = datos.getOrDefault("motivo", "No especificado");
        anuncio.setEstado("rechazado");
        anuncioService.save(anuncio);

        Usuario usuario = anuncio.getUsuario();
        emailService.enviarCorreo(usuario.getCorreoElectronico(),
                "Anuncio rechazado",
                "Hola " + usuario.getNombre() + ", tu anuncio fue rechazado. Motivo: " + motivo);

        String contenido = "Tu anuncio <strong>" + anuncio.getTitulo() + "</strong> fue rechazado.\nMotivo: " + motivo;
        notificacionService.crear(contenido, "RECHAZO", usuario);

        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/crearAnuncios", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<?> crearAnuncio(
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") String precio,
            @RequestParam("localizacion") String localizacion,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam("estadoArticuloId") Integer estadoArticuloId,
            @RequestParam(value = "imagenes", required = false) MultipartFile[] imagenes,
            HttpSession session) {

        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }

        try {
            Anuncio anuncio = new Anuncio();
            anuncio.setTitulo(titulo);
            anuncio.setDescripcion(descripcion);
            anuncio.setPrecio(new BigDecimal(precio.replace(",", ".")));
            anuncio.setUbicacion(localizacion);
            anuncio.setEstado("pendiente");
            anuncio.setFechaPublicacion(LocalDateTime.now());
            anuncio.setUsuario(usuario);

            Categoria categoria = categoriaService.findById(categoriaId)
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            anuncio.setCategoria(categoria);

            EstadoArticulo estadoArticulo = estadoArticuloService.findById(estadoArticuloId)
                    .orElseThrow(() -> new RuntimeException("Estado del artículo no encontrado"));
            anuncio.setEstadoArticulo(estadoArticulo);

            anuncioService.save(anuncio);

            if (imagenes != null && imagenes.length > 0) {
                int orden = 1;
                for (MultipartFile imagen : imagenes) {
                    if (!imagen.isEmpty()) {
                        String urlImagen = cloudinaryService.subirImagen(imagen);

                        ImagenAnuncio img = new ImagenAnuncio();
                        img.setAnuncio(anuncio);
                        img.setUrlImagen(urlImagen);
                        img.setOrden(orden++);
                        imagenAnuncioService.save(img);
                    }
                }
            }

            return ResponseEntity.ok("Anuncio creado correctamente con estado pendiente");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al crear anuncio: " + e.getMessage());
        }
    }

    @GetMapping("/anuncios/aprobados/usuario")
    @ResponseBody
    public List<AnuncioDTO> anunciosAprobadosUsuarioLogueado(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            return List.of(); // Usuario no autenticado, devuelve lista vacía
        }
        List<Anuncio> anuncios = anuncioService.obtenerAprobadosPorUsuario(usuario.getId());
        return anuncios.stream()
                .map(this::toDTO)
                .toList();
    }

    public AnuncioDTO toDTO(Anuncio anuncio) {
        AnuncioDTO dto = new AnuncioDTO();
        dto.setId(anuncio.getId());
        dto.setTitulo(anuncio.getTitulo());
        dto.setPrecioFormateado(anuncio.getPrecioFormateado());
        dto.setDescripcion(anuncio.getDescripcion());
        dto.setUbicacion(anuncio.getUbicacion());
        if (anuncio.getImagenes() != null && !anuncio.getImagenes().isEmpty()) {
            dto.setImagenPrincipalUrl(anuncio.getImagenes().get(0).getUrlImagen());
        } else {
            dto.setImagenPrincipalUrl(null);
        }
        return dto;
    }

    
}
