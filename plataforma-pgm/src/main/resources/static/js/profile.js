document.addEventListener('DOMContentLoaded', () => {
    // --------- Manejo menú secciones ---------
    const buttons = document.querySelectorAll('.menu-btn');
    const sections = document.querySelectorAll('.content-section');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.section).classList.add('active');
        });
    });

    // --------- Variables para foto perfil ---------
    const profilePhotoWrapper = document.querySelector('.profile-photo-wrapper');
    const photoOverlay = document.getElementById('photo-overlay');
    const photoMenu = document.getElementById('photo-menu');
    const fileInput = document.getElementById('foto');
    const profilePhoto = document.getElementById('profile-photo');
    const defaultPhoto = '/img/icoperfil.png';

    // Asignar imagen por defecto si no hay foto de perfil
    if (!profilePhoto.getAttribute('src') || profilePhoto.src.endsWith('/null')) {
        profilePhoto.src = defaultPhoto;
    }

    // Mostrar/ocultar menú contextual al hacer clic en la imagen
    profilePhotoWrapper.addEventListener('click', e => {
        e.stopPropagation();
        const isVisible = photoMenu.style.display === 'block';
        photoMenu.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            const rect = profilePhotoWrapper.getBoundingClientRect();
            photoMenu.style.top = `${rect.bottom + window.scrollY + 5}px`;
            photoMenu.style.left = `${rect.left + window.scrollX}px`;
        }
    });

    // Ocultar menú si haces clic fuera
    document.addEventListener('click', () => {
        photoMenu.style.display = 'none';
    });

    // Cambiar foto de perfil: previsualizar imagen
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                profilePhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Botón para cambiar la foto
    document.getElementById('change-photo-btn').addEventListener('click', () => {
        fileInput.click();
        photoMenu.style.display = 'none';
    });

    // Botón para quitar la foto (restablecer a por defecto)
    document.getElementById('remove-photo-btn').addEventListener('click', () => {
        profilePhoto.src = defaultPhoto;
        fileInput.value = '';

        // Si quieres notificar al backend que se debe eliminar la foto
        const inputHiddenRemove = document.getElementById('removePhoto');
        if (inputHiddenRemove) {
            inputHiddenRemove.value = 'true';
        }

        photoMenu.style.display = 'none';
    });

    // --------- País y ciudades ---------
    const ciudadesPorPais = {
        "España": [
            "Selecciona una ciudad...", "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza",
            "Málaga", "Murcia", "Palma", "Las Palmas de Gran Canaria", "Bilbao",
            "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón",
            "Hospitalet de Llobregat", "La Coruña", "Granada", "Elche", "Oviedo"
        ]
    };

    const paisSelect = document.getElementById('pais');
    const ciudadSelect = document.getElementById('ciudad');

    function llenarCiudades(pais) {
        ciudadSelect.innerHTML = '';
        if (!pais || !ciudadesPorPais[pais]) {
            ciudadSelect.disabled = true;
            ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
            return;
        }
        ciudadSelect.disabled = false;
        ciudadesPorPais[pais].forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad;
            ciudadSelect.appendChild(option);
        });
    }

    paisSelect.addEventListener('change', (e) => {
        llenarCiudades(e.target.value);
    });

    // --------- Cargar datos usuario desde backend simulados ---------
    const usuario = window.usuarioLogueado || {
        nombre: '',
        correoElectronico: '',
        telefono: '',
        pais: '',
        ciudad: '',
        fotoPerfil: '',
    };

    document.getElementById('nombre').value = usuario.nombre || '';
    document.getElementById('correoElectronico').value = usuario.correoElectronico || '';
    document.getElementById('telefono').value = usuario.telefono || '';
    paisSelect.value = usuario.pais || '';
    llenarCiudades(usuario.pais);
    ciudadSelect.value = usuario.ciudad || '';

    if (usuario.fotoPerfil) {
        profilePhoto.src = usuario.fotoPerfil;
    } else {
        profilePhoto.src = defaultPhoto;
    }

    // --------- Envío formulario ---------
    document.getElementById('user-settings-form').addEventListener('submit', e => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const fileInput = document.getElementById('foto');
        if (fileInput.files.length > 0) {
            formData.append('foto', fileInput.files[0]);
        }

        fetch('/api/usuario/actualizar', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    alert('Error: ' + data.error);
                } else {
                    alert('Datos guardados correctamente');
                    window.usuarioLogueado = data.usuario;
                }
            })
            .catch(err => {
                alert('Error guardando datos: ' + err.message);
            });
    });

    document.getElementById('btnLogout').addEventListener('click', (e) => {
        e.preventDefault();

        fetch('/logout', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    console.log("Sesión cerrada");
                }
            })
            .catch(error => {
                console.error("Error al cerrar sesión:", error);
            });
    });

    // --------- Bloque de moderación robusto ---------
    try {
        function agregarListenersModeracion() {
            document.querySelectorAll('.btn-aprobar').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    fetch(`/${id}/aprobar`, {
                        method: 'POST'
                    })
                        .then(res => {
                            if (res.ok) {
                                btn.closest('.anuncio-card')?.remove();
                            } else {
                                alert('Error al aprobar el anuncio');
                            }
                        })
                        .catch(err => {
                            console.error('Error al aprobar:', err);
                            alert('Error al aprobar el anuncio');
                        });
                });
            });

            document.querySelectorAll('.btn-rechazar').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');

                    // Pedir motivo con prompt
                    const motivo = prompt('Por favor, escribe el motivo del rechazo:');
                    if (motivo === null || motivo.trim() === '') {
                        alert('Debe ingresar un motivo para rechazar.');
                        return; // salir si no se pone motivo
                    }

                    fetch(`/${id}/rechazar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ motivo })
                    })
                        .then(res => {
                            if (res.ok) {
                                btn.closest('.anuncio-card')?.remove();
                            } else {
                                alert('Error al rechazar el anuncio');
                            }
                        })
                        .catch(err => {
                            console.error('Error al rechazar:', err);
                            alert('Error al rechazar el anuncio');
                        });
                });
            });

        }

        agregarListenersModeracion();
    } catch (err) {
        console.error('Error en sistema de moderación:', err);
    }

    // --------- Carrusel de imágenes ---------
    const modal = document.getElementById('modalCarrusel');
    const modalImg = document.getElementById('imagen-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');

    let images = [];
    let currentIndex = 0;
    let zoomed = false;

    document.querySelectorAll('.img-thumb').forEach(img => {
        img.addEventListener('click', (e) => {
            const clickedImg = e.target;
            const anuncioDiv = clickedImg.closest('.anuncio-card');

            images = Array.from(anuncioDiv.querySelectorAll('.img-thumb')).map(i => i.src);
            currentIndex = images.indexOf(clickedImg.src);

            modalImg.src = images[currentIndex];
            modal.style.display = 'flex';

            zoomed = false;
            modalImg.classList.remove('zoomed');
            resetZoom();
        });
    });

    prevBtn.addEventListener('click', () => {
        if (images.length === 0) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex];

        zoomed = false;
        modalImg.classList.remove('zoomed');
        resetZoom();
    });

    nextBtn.addEventListener('click', () => {
        if (images.length === 0) return;
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex];

        zoomed = false;
        modalImg.classList.remove('zoomed');
        resetZoom();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        modalImg.src = '';
        images = [];
        zoomed = false;
        modalImg.classList.remove('zoomed');
        resetZoom();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalImg.src = '';
            images = [];
            zoomed = false;
            modalImg.classList.remove('zoomed');
            resetZoom();
        }
    });

    modalImg.addEventListener('click', (e) => {
        zoomed = !zoomed;
        if (zoomed) {
            modalImg.classList.add('zoomed');
            moveZoom(e);
        } else {
            modalImg.classList.remove('zoomed');
            resetZoom();
        }
    });

    modalImg.addEventListener('mousemove', (e) => {
        if (!zoomed) return;
        moveZoom(e);
    });

    function moveZoom(e) {
        const rect = modalImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        modalImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        modalImg.style.transform = 'scale(2)';
    }

    function resetZoom() {
        modalImg.style.transformOrigin = 'center center';
        modalImg.style.transform = 'scale(1)';
    }

    document.querySelectorAll('.btn-rechazar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const motivo = prompt("¿Por qué estás rechazando este anuncio?");
            if (!motivo) return;

            fetch(`/${id}/rechazar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ motivo })
            })
                .then(res => {
                    if (res.ok) {
                        btn.closest('.anuncio-card')?.remove();
                        window.location.reload()
                    } else {
                        alert('Error al rechazar el anuncio');
                    }
                })
                .catch(err => {
                    console.error('Error al rechazar:', err);
                    alert('Error al rechazar el anuncio');
                });
        });
    });

    window.addEventListener('DOMContentLoaded', () => {
        const notificacionesDiv = document.getElementById('notificaciones');
        const usuarioId = notificacionesDiv.getAttribute('data-user-id');
        const lista = document.getElementById('lista-notificaciones');

        if (!usuarioId) {
            console.error('No se encontró el ID del usuario.');
            lista.innerHTML = '<li>Error: usuario no identificado.</li>';
            return;
        }

        fetch(`/notificaciones/usuario/${usuarioId}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                lista.innerHTML = '';

                if (!Array.isArray(data) || data.length === 0) {
                    lista.innerHTML = '<li>No hay notificaciones.</li>';
                    return;
                }

                data.forEach(noti => {
                    const item = document.createElement('li');
                    item.innerHTML = `
                    <strong>${new Date(noti.fechaEnvio).toLocaleString()}</strong><br>
                    ${noti.contenido}
                `;
                    lista.appendChild(item);
                });
            })
            .catch(err => {
                console.error('Error al cargar notificaciones:', err);
                lista.innerHTML = '<li>Error al cargar notificaciones.</li>';
            });
    });
});
