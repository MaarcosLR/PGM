package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.DTO.UsuarioDTO;
import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.service.AnuncioService;
import com.pgm.plataformapgm.service.CloudinaryService;
import com.pgm.plataformapgm.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class PerfilController {

    private final UsuarioService usuarioService;

    private final AnuncioService anuncioService;

    private final CloudinaryService cloudinaryService;

    public PerfilController(UsuarioService usuarioService, AnuncioService anuncioService, CloudinaryService cloudinaryService) {
        this.usuarioService = usuarioService;
        this.anuncioService = anuncioService;
        this.cloudinaryService = cloudinaryService;
    }

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
                String urlFoto = cloudinaryService.subirImagen(foto);
                usuarioSesion.setFotoPerfil(urlFoto);
            } catch (IOException e) {
                response.put("error", "Error subiendo la foto: " + e.getMessage());
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

        try {
            if (usuarioSesion.getFotoPerfil() != null && !usuarioSesion.getFotoPerfil().isEmpty()) {
                cloudinaryService.eliminarImagen(usuarioSesion.getFotoPerfil());
            }
            usuarioSesion.setFotoPerfil(null);
            usuarioService.save(usuarioSesion);
            session.setAttribute("usuarioLogueado", usuarioSesion);

            response.put("success", true);
            response.put("mensaje", "Foto de perfil eliminada correctamente");
        } catch (IOException e) {
            response.put("error", "Error eliminando la foto: " + e.getMessage());
        }
        return response;
    }

}
