package com.pgm.plataformapgm.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    @Column(name = "correo_electronico", unique = true, nullable = false)
    private String correoElectronico;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "tipo_cuenta", nullable = false)
    private String tipoCuenta;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(name = "pais")
    private String pais;

    @Column(name = "ciudad")
    private String ciudad;

    @Column(name = "telefono")
    private String telefono;

    // Relaciones
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Anuncio> anuncios;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Notificacion> notificaciones;

    // Ajuste en getter
    public String getFotoPerfil() {
        if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
            return fotoPerfil; // URL absoluta de Cloudinary
        }
        return "/img/icologo.png"; // Imagen por defecto local
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuario_favoritos",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "anuncio_id"))
    private Set<Anuncio> favoritos = new HashSet<>();
}

