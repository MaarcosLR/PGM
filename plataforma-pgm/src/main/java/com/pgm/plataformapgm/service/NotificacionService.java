package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.model.Notificacion;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    public void crear(String contenido, String tipoNotificacion, Usuario usuario) {
        Notificacion notificacion = new Notificacion();
        notificacion.setContenido(contenido);
        notificacion.setTipoNotificacion(tipoNotificacion);
        notificacion.setUsuario(usuario);
        notificacion.setLeida(false);
        notificacion.setFechaEnvio(LocalDateTime.now());

        notificacionRepository.save(notificacion);
    }

    public void guardar(Notificacion notificacion) {
        notificacionRepository.save(notificacion);
    }

    public Optional<Notificacion> obtenerPorId(Integer id) {
        return notificacionRepository.findById(id);
    }

    public List<Notificacion> obtenerPorUsuario(Integer usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId);
    }
}

