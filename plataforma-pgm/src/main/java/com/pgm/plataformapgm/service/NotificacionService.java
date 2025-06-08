package com.pgm.plataformapgm.service;

import com.pgm.plataformapgm.model.Notificacion;
import com.pgm.plataformapgm.model.Usuario;
import com.pgm.plataformapgm.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

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

    public List<Notificacion> obtenerPorUsuario(Integer usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId);
    }
}

