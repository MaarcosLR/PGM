package com.pgm.plataformapgm.controller;

import com.pgm.plataformapgm.model.Anuncio;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.service.AnuncioService;
import com.pgm.plataformapgm.service.UsuarioService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class PerfilController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AnuncioService anuncioService;

    @GetMapping("/profile.html")
    public String perfil(HttpSession session, Model model) {
        // Obtener usuario guardado en sesión
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");

        if (usuario == null) {
            // No hay usuario en sesión => redirigir a login
            return "redirect:/login.html";
        }

        // Puedes refrescar datos del usuario si quieres, por ejemplo:
        usuario = usuarioService.findById(usuario.getId());

        // Obtener anuncios publicados y solicitados
        List<Anuncio> publicados = anuncioService.findByUsuarioAndEstado(usuario, "publicado");
        List<Anuncio> solicitados = anuncioService.findByUsuarioAndEstado(usuario, "solicitado");

        // Pasar datos a la vista
        model.addAttribute("usuario", usuario);
        model.addAttribute("publicados", publicados);
        model.addAttribute("solicitados", solicitados);

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

        // Actualizar campos
        usuarioSesion.setNombre(nombre);
        usuarioSesion.setCorreoElectronico(correoElectronico);
        usuarioSesion.setTelefono(telefono);
        usuarioSesion.setPais(pais);
        usuarioSesion.setCiudad(ciudad);

        if (foto != null && !foto.isEmpty()) {
            // Aquí guardar el archivo y obtener nombre/ruta
            String nombreFoto = guardarArchivoFoto(foto);
            usuarioSesion.setFotoPerfil(nombreFoto);
        }

        usuarioService.save(usuarioSesion);

        // Actualizar sesión con usuario actualizado
        session.setAttribute("usuarioLogueado", usuarioSesion);

        response.put("success", true);
        response.put("usuario", usuarioSesion);
        return response;
    }

    private String guardarArchivoFoto(MultipartFile foto) {
        // Implementa guardar archivo en servidor y retorna ruta/nombre
        return "ruta_o_nombre_de_la_foto.jpg";
    }
}
