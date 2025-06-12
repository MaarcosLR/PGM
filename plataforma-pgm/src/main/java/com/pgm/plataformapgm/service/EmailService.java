package com.pgm.plataformapgm.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCorreo(String para, String asunto, String contenido) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(para);
        mensaje.setSubject(asunto);
        mensaje.setText(contenido);
        mensaje.setFrom("infopgm2025@gmail.com");
        mailSender.send(mensaje);
    }

    public void enviarCorreoRegistroExitoso(String paraEmail, String nombreUsuario) {
        String asunto = "Registro exitoso en Plataforma PGM";
        String mensaje = "Hola " + nombreUsuario + ",\n\n" +
                "Gracias por registrarte en Plataforma PGM. Tu registro se ha realizado correctamente.\n\n" +
                "Saludos,\nEl equipo de Plataforma PGM";

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(paraEmail);
        email.setSubject(asunto);
        email.setText(mensaje);

        mailSender.send(email);
    }
}
