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

    const removePhotoBtn = document.getElementById('remove-photo-btn');

    // Botón para quitar la foto (restablecer a por defecto)
    removePhotoBtn.addEventListener('click', () => {
        fetch('/api/usuario/foto/eliminar', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(async data => {
                if (data.success) {
                    // Cambiar la foto al icono por defecto
                    profilePhoto.src = defaultPhoto;

                    // Opcional: limpiar input file si tienes uno para subir foto
                    const fileInput = document.getElementById('foto-input');
                    if (fileInput) fileInput.value = '';

                    await mostrarModalMensaje('Foto de perfil eliminada correctamente');
                } else if (data.error) {
                    await mostrarModalMensaje('Error: ' + data.error);
                }
            })
            .catch(async error => {
                console.error('Error eliminando la foto:', error);
                await mostrarModalMensaje('Error eliminando la foto de perfil.');
            });
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
    document.getElementById('user-settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const fileInput = document.getElementById('foto');
        if (fileInput.files.length > 0) {
            formData.append('foto', fileInput.files[0]);
        }

        try {
            const resp =  fetch('/api/usuario/actualizar', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data =  resp.json();

            if (data.error) {
                 await mostrarModalMensaje('Error: ' + data.error);
            } else {
                 await mostrarModalMensaje('Datos guardados correctamente');
                window.usuarioLogueado = data.usuario;
                location.reload();  // Recarga la página tras cerrar el modal
            }
        } catch (err) {
             await mostrarModalMensaje('Error guardando datos: ' + err.message);
        }
    });

    document.getElementById('btnLogout').addEventListener('click', (e) => {
        e.preventDefault();

        fetch('/logout', {
            method: 'GET',
            credentials: 'include'
        })
            .then(async response => {
                if (response.redirected) {
                    await mostrarModalMensaje("Se ha cerrado su sesión")
                    window.location.href = response.url;

                } else {
                    await mostrarModalMensaje("Se ha cerrado su sesión")
                }
            })
            .catch(async error => {
                await mostrarModalMensaje("Error al cerrar sesión:", error);
            });
    });

    // --------- Bloque de moderación robusto ---------
    try {
        function actualizarContadorRestar() {
            const badge = document.querySelector('#btn-peticiones .badge');
            if (badge) {
                let count = parseInt(badge.textContent, 10);
                count = isNaN(count) ? 0 : count;
                badge.textContent = Math.max(0, count - 1);
            }
        }

        function agregarListenersModeracion() {
            document.querySelectorAll('.btn-aprobar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                     fetch(`/${id}/aprobar`, {
                        method: 'POST'
                    })
                        .then(async res => {
                            if (res.ok) {
                                btn.closest('.anuncio-card')?.remove();
                                actualizarContadorRestar();
                                 await mostrarModalMensaje('Anuncio aprobado correctamente');
                            } else {
                                 await mostrarModalMensaje('Error al aprobar el anuncio');
                            }
                        })
                        .catch(async err => {
                            console.error('Error al aprobar:', err);
                             await mostrarModalMensaje('Error al aprobar el anuncio');
                        });
                });
            });

            document.querySelectorAll('.btn-rechazar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');

                    const motivo =  await mostrarModalMensaje('Por favor, escribe el motivo del rechazo:', true);
                    if (!motivo) {
                         await mostrarModalMensaje('Debe ingresar un motivo para rechazar.');
                        return;
                    }

                     fetch(`/${id}/rechazar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({motivo})
                    })
                        .then(async res => {
                            if (res.ok) {
                                btn.closest('.anuncio-card')?.remove();
                                actualizarContadorRestar();
                                 await mostrarModalMensaje('Anuncio rechazado correctamente.');
                            } else {
                                 await mostrarModalMensaje('Error al rechazar el anuncio');
                            }
                        })
                        .catch(async err => {
                            console.error('Error al rechazar:', err);
                             await mostrarModalMensaje('Error al rechazar el anuncio');
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

    window.addEventListener('DOMContentLoaded', () => {
        const notificacionesDiv = document.getElementById('notificaciones');
        const usuarioId = notificacionesDiv.getAttribute('data-user-id');
        const lista = document.getElementById('lista-notificaciones');
        const badge = document.querySelector('#btn-notificaciones .badge');

        if (!usuarioId) {
            console.error('No se encontró el ID del usuario.');
            lista.innerHTML = '<li>Error: usuario no identificado.</li>';
            return;
        }

        function actualizarBadge(notificaciones) {
            const noLeidasCount = notificaciones.filter(n => !n.leida).length;
            badge.textContent = noLeidasCount;
            badge.style.display = noLeidasCount > 0 ? 'inline-block' : 'none';
        }

        function marcarComoLeida(noti, item, notificaciones) {
            fetch(`/notificaciones/${noti.id}/leer`, {
                method: 'POST'
            })
                .then(async res => {
                    if (res.ok) {
                        noti.leida = true;
                        item.classList.remove('noti-no-leida');
                        const botonLeer = item.querySelector('.btn-marcar-leida');
                        if (botonLeer) botonLeer.style.display = 'none';
                        actualizarBadge(notificaciones);
                    } else {
                        await mostrarModalMensaje('Error al marcar la notificación como leída');
                    }
                })
                .catch(async err => {
                    console.error('Error al marcar notificación leída:', err);
                    await mostrarModalMensaje('Error al marcar la notificación como leída');
                });
        }

        fetch(`/notificaciones/usuario/${usuarioId}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(notificaciones => {
                lista.innerHTML = '';

                if (!Array.isArray(notificaciones) || notificaciones.length === 0) {
                    lista.innerHTML = '<li>No hay notificaciones.</li>';
                    actualizarBadge([]);
                    return;
                }

                actualizarBadge(notificaciones);

                notificaciones.forEach(noti => {
                    const item = document.createElement('li');
                    item.classList.add('notificacion-item');
                    if (!noti.leida) {
                        item.classList.add('noti-no-leida');
                    }

                    // Detectar tipo de notificación para aplicar color
                    let color = '#333';
                    if (noti.tipo === 'APROBACION') color = 'green';
                    if (noti.tipo === 'RECHAZO') color = 'red';

                    const contenido = `
                        <div class="noti-header">
                            <strong>${new Date(noti.fechaEnvio).toLocaleString()}</strong>
                        </div>
                        <div class="noti-body">
                            <span style="color:${color};">${noti.contenido}</span>
                            ${!noti.leida ? `<button class="btn-marcar-leida" title="Marcar como leída">👁️</button>` : ''}
                        </div>
                    `;

                    item.innerHTML = contenido;

                    if (!noti.leida) {
                        const btnLeer = item.querySelector('.btn-marcar-leida');
                        btnLeer.addEventListener('click', () => marcarComoLeida(noti, item, notificaciones));
                    }

                    lista.appendChild(item);
                });
            })
            .catch(err => {
                console.error('Error al cargar notificaciones:', err);
                lista.innerHTML = '<li>Error al cargar notificaciones.</li>';
                actualizarBadge([]);
            });
    });



    function cargarFavoritos() {
        const listaFavoritos = document.getElementById('lista-favoritos');
        listaFavoritos.innerHTML = '<p>Cargando favoritos...</p>';

        fetch('/api/favoritos', { credentials: 'include' })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    listaFavoritos.innerHTML = `<p>Error al cargar favoritos: ${data.error}</p>`;
                    return;
                }

                if (!data || data.length === 0) {
                    listaFavoritos.innerHTML = '<p>No tienes anuncios favoritos aún.</p>';
                    return;
                }

                listaFavoritos.innerHTML = ''; // Limpiar "Cargando..."

                data.forEach(anuncio => {
                    const anuncioDiv = document.createElement('div');
                    anuncioDiv.classList.add('anuncio-card');

                    // Construimos el contenido dentro de un <a> con display:flex para que se mantenga el layout
                    anuncioDiv.innerHTML = `
                    <a href="/anuncio/${anuncio.id}" class="anuncio-link" style="display: flex; text-decoration: none; color: inherit;">
                        <div class="imagenes-collage" style="flex-shrink: 0;">
                            <div class="img-grid">
                                <img src="${anuncio.imagenPrincipalUrl || '/img/default.png'}" alt="Imagen de anuncio" class="img-thumb" />
                            </div>
                        </div>
                        <div class="info-anuncio" style="margin-left: 1rem;">
                            <p><strong>Título:</strong> ${anuncio.titulo}</p>
                            <p><strong>Precio:</strong> ${anuncio.precioFormateado}</p>
                            <p><strong>Descripción:</strong> ${anuncio.descripcion}</p>
                            <p><strong>Ubicación:</strong> ${anuncio.ubicacion}</p>
                        </div>
                    </a>
                `;

                    listaFavoritos.appendChild(anuncioDiv);
                });

            })
            .catch(err => {
                listaFavoritos.innerHTML = `<p>Error al cargar favoritos: ${err.message}</p>`;
            });
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const section = document.getElementById(btn.dataset.section);
            section.classList.add('active');

            if (btn.dataset.section === 'favoritos') {
                cargarFavoritos();
            }
        });
    });

    function cargarAnunciosPublicados() {
        const contenedor = document.getElementById('anunciosPublicados');
        contenedor.innerHTML = '<p>Cargando anuncios publicados...</p>';

        fetch('/anuncios/aprobados/usuario', { credentials: 'include' })
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar anuncios');
                return response.json();
            })
            .then(anuncios => {
                contenedor.innerHTML = ''; // Limpiar mensaje de carga

                if (!anuncios || anuncios.length === 0) {
                    contenedor.innerHTML = '<p>No tienes anuncios publicados.</p>';
                    return;
                }

                anuncios.forEach(anuncio => {
                    const anuncioDiv = document.createElement('div');
                    anuncioDiv.classList.add('anuncio-card');

                    anuncioDiv.innerHTML = `
                    <a href="/anuncio/${anuncio.id}" class="anuncio-link" style="display: flex; text-decoration: none; color: inherit;">
                        <div class="imagenes-collage" style="flex-shrink: 0;">
                            <div class="img-grid">
                                <img src="${anuncio.imagenPrincipalUrl || '/img/default.png'}" alt="Imagen de anuncio" class="img-thumb" />
                            </div>
                        </div>
                        <div class="info-anuncio" style="margin-left: 1rem;">
                            <p><strong>Título:</strong> ${anuncio.titulo}</p>
                            <p><strong>Precio:</strong> ${anuncio.precioFormateado}</p>
                            <p><strong>Descripción:</strong> ${anuncio.descripcion}</p>
                            <p><strong>Ubicación:</strong> ${anuncio.ubicacion}</p>
                        </div>
                    </a>
                `;

                    contenedor.appendChild(anuncioDiv);
                });
            })
            .catch(error => {
                contenedor.innerHTML = `<p>Error al cargar anuncios: ${error.message}</p>`;
                console.error('Error al cargar anuncios:', error);
            });
    }

    cargarAnunciosPublicados();


});
