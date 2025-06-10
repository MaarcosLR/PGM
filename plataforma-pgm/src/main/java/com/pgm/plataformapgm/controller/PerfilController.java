package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.UsuarioDTO;
import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.service.AnuncioService;
import com.pgm.plataformapgm.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Controller
public class PerfilController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AnuncioService anuncioService;

    @Value("${upload.dir}") // Inyecta la ruta base de uploads desde application.properties
    private String uploadDir;

    @GetMapping("/profile.html")
    public String perfil(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            return "redirect:/login.html";
        }

        usuario = usuarioService.findById(usuario.getId());

        List<Anuncio> aprobados = anuncioService.findByUsuarioAndEstado(usuario, "aprobado");
        List<Anuncio> solicitados = anuncioService.findByUsuarioAndEstado(usuario, "solicitado");

        boolean esAdmin = "admin".equalsIgnoreCase(usuario.getTipoCuenta());

        List<Anuncio> pendientes = null;
        if (esAdmin) {
            pendientes = anuncioService.findByEstado("pendiente");
        }

        model.addAttribute("usuario", usuario);
        model.addAttribute("aprobados", aprobados);
        model.addAttribute("solicitados", solicitados);
        model.addAttribute("esAdmin", esAdmin);
        model.addAttribute("pendientes", pendientes);

        return "profile";
    }

    @PostMapping("/api/usuario/actualizar")
    @ResponseBody
    public Map<String, Object> actualizarUsuario(
            HttpSession session,
            @RequestParam String nombre,
            @RequestParam String correoElectronico,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String pais,
            @RequestParam(required = false) String ciudad,
            @RequestPart(required = false) MultipartFile foto
    ) {
        Map<String, Object> response = new HashMap<>();

        Usuario usuarioSesion = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuarioSesion == null) {
            response.put("error", "Usuario no autenticado");
            return response;
        }

        if (nombre == null || nombre.trim().isEmpty()) {
            response.put("error", "El nombre es obligatorio");
            return response;
        }
        if (correoElectronico == null || correoElectronico.trim().isEmpty()) {
            response.put("error", "El correo electrónico es obligatorio");
            return response;
        }

        usuarioSesion.setNombre(nombre);
        usuarioSesion.setCorreoElectronico(correoElectronico);
        usuarioSesion.setTelefono(telefono);
        usuarioSesion.setPais(pais);
        usuarioSesion.setCiudad(ciudad);

        if (foto != null && !foto.isEmpty()) {
            try {
                String nombreFotoAnterior = usuarioSesion.getFotoPerfil();
                String nombreFotoNueva = guardarArchivoFoto(foto, usuarioSesion.getId(), nombreFotoAnterior);
                usuarioSesion.setFotoPerfil(nombreFotoNueva);
            } catch (IOException e) {
                response.put("error", "Error guardando la foto: " + e.getMessage());
                return response;
            }
        }

        usuarioService.save(usuarioSesion);

        session.setAttribute("usuarioLogueado", usuarioSesion);

        response.put("success", true);
        response.put("usuario", new UsuarioDTO(usuarioSesion));
        return response;
    }

    @DeleteMapping("/api/usuario/foto/eliminar")
    @ResponseBody
    public Map<String, Object> eliminarFotoPerfil(HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        Usuario usuarioSesion = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuarioSesion == null) {
            response.put("error", "Usuario no autenticado");
            return response;
        }

        String fotoPerfil = usuarioSesion.getFotoPerfil();
        if (fotoPerfil == null || fotoPerfil.isEmpty()) {
            response.put("error", "No hay foto de perfil para eliminar");
            return response;
        }

        try {
            // Eliminar archivo físico
            Path archivoFoto = Paths.get(uploadDir).resolve(fotoPerfil);
            if (Files.exists(archivoFoto)) {
                Files.delete(archivoFoto);
            }

            // Actualizar usuario para quitar foto
            usuarioSesion.setFotoPerfil(null);
            usuarioService.save(usuarioSesion);

            // Actualizar sesión
            session.setAttribute("usuarioLogueado", usuarioSesion);

            response.put("success", true);
            response.put("mensaje", "Foto de perfil eliminada correctamente");
        } catch (IOException e) {
            response.put("error", "Error eliminando la foto: " + e.getMessage());
        }

        return response;
    }

    // Actualizo guardarArchivoFoto para eliminar la anterior si existe
    private String guardarArchivoFoto(MultipartFile foto, Integer usuarioId, String nombreFotoAnterior) throws IOException {
        // Carpeta usuario
        Path usuarioDir = Paths.get(uploadDir, "pfp", "Usuario_" + usuarioId);
        if (!Files.exists(usuarioDir)) {
            Files.createDirectories(usuarioDir);
        }

        // Eliminar foto anterior
        if (nombreFotoAnterior != null && !nombreFotoAnterior.isEmpty()) {
            Path archivoAnterior = Paths.get(uploadDir).resolve(nombreFotoAnterior);
            if (Files.exists(archivoAnterior)) {
                Files.delete(archivoAnterior);
            }
        }

        String nombreOriginal = StringUtils.cleanPath(foto.getOriginalFilename());
        String extension = "";

        int i = nombreOriginal.lastIndexOf('.');
        if (i > 0) {
            extension = nombreOriginal.substring(i);
        }

        String nuevoNombre = "perfil_" + System.currentTimeMillis() + extension;
        Path destino = usuarioDir.resolve(nuevoNombre);

        // Optimizar y guardar
        Thumbnails.of(foto.getInputStream())
                .size(600, 600)
                .outputQuality(0.75)
                .toFile(destino.toFile());

        // Retornar ruta relativa
        return "pfp/Usuario_" + usuarioId + "/" + nuevoNombre;
    }
}