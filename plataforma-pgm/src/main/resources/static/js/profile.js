document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cargarModal(); // Asegura que el modal esté listo
        console.log('✅ Modal cargado correctamente');

        inicializarUI();               // Elementos visuales y eventos generales
        agregarListenersModeracion();  // Botones de aprobar/rechazar
        agregarListenerFormularioUsuario(); // Formulario usuario
        agregarListenerLogout();       // Logout
        inicializarCarruselYNotificaciones(); // Lo que me diste ahora (carrusel, notificaciones, anuncios, favoritos)
    } catch (error) {
        console.error('❌ Error inicializando la app:', error);
    }
});

// Funciones auxiliares

function inicializarUI() {
    // Menú de secciones
    const buttons = document.querySelectorAll('.menu-btn');
    const sections = document.querySelectorAll('.content-section');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.section).classList.add('active');

            if (btn.dataset.section === 'favoritos') {
                cargarFavoritos();
            }
        });
    });

    // Imagen de perfil
    const profilePhotoWrapper = document.querySelector('.profile-photo-wrapper');
    const photoMenu = document.getElementById('photo-menu');
    const fileInput = document.getElementById('foto');
    const profilePhoto = document.getElementById('profile-photo');
    const defaultPhoto = '/img/icoperfil.png';

    if (!profilePhoto.getAttribute('src') || profilePhoto.src.endsWith('/null')) {
        profilePhoto.src = defaultPhoto;
    }

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

    document.addEventListener('click', () => photoMenu.style.display = 'none');

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => profilePhoto.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('change-photo-btn').addEventListener('click', () => {
        fileInput.click();
        photoMenu.style.display = 'none';
    });

    document.getElementById('remove-photo-btn').addEventListener('click', () => {
        fetch('/api/usuario/foto/eliminar', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(async data => {
                if (data.success) {
                    profilePhoto.src = defaultPhoto;
                    document.getElementById('foto').value = '';
                    await window.mostrarMensaje('✅ Foto de perfil eliminada correctamente');
                } else {
                    await window.mostrarMensaje('❌ Error: ' + data.error);
                }
            })
            .catch(async error => {
                console.error('Error eliminando la foto:', error);
                await window.mostrarMensaje('❌ Error eliminando la foto de perfil.');
            });
    });

    // Cargar datos usuario
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

    paisSelect.addEventListener('change', e => llenarCiudades(e.target.value));

    const usuario = window.usuarioLogueado || {
        nombre: '', correoElectronico: '', telefono: '', pais: '', ciudad: '', fotoPerfil: ''
    };

    document.getElementById('nombre').value = usuario.nombre || '';
    document.getElementById('correoElectronico').value = usuario.correoElectronico || '';
    document.getElementById('telefono').value = usuario.telefono || '';
    paisSelect.value = usuario.pais || '';
    llenarCiudades(usuario.pais);
    ciudadSelect.value = usuario.ciudad || '';
    profilePhoto.src = usuario.fotoPerfil || defaultPhoto;
}

function agregarListenerFormularioUsuario() {
    const form = document.getElementById('user-settings-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const formData = new FormData(form);
        const fileInput = document.getElementById('foto');
        if (fileInput?.files.length > 0) {
            formData.append('foto', fileInput.files[0]);
        }

        try {
            const resp = await fetch('/api/usuario/actualizar', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await resp.json();
            if (data.error) {
                await window.mostrarMensaje('❌ Error: ' + data.error);
            } else {
                await window.mostrarMensaje('✅ Datos guardados correctamente');
                window.usuarioLogueado = data.usuario;
                location.reload();
            }
        } catch (err) {
            await window.mostrarMensaje('❌ Error guardando datos: ' + err.message);
        }
    });
}

function agregarListenerLogout() {
    const btnLogout = document.getElementById('btnLogout');
    if (!btnLogout) return;

    btnLogout.addEventListener('click', async e => {
        e.preventDefault();

        const confirmado = await window.mostrarConfirmacion('¿Estás seguro de que deseas cerrar sesión?');
        if (!confirmado) return;

        try {
            const response = await fetch('/logout', {
                method: 'GET',
                credentials: 'include'
            });

            await window.mostrarMensaje('✅ Sesión cerrada correctamente');
            if (response.redirected) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            await window.mostrarMensaje('❌ Hubo un error al cerrar la sesión.');
        }
    });
}

function agregarListenersModeracion() {
    const actualizarContadorRestar = () => {
        const badge = document.querySelector('#btn-peticiones .badge');
        if (badge) {
            let count = parseInt(badge.textContent, 10);
            badge.textContent = Math.max(0, isNaN(count) ? 0 : count - 1);
        }
    };

    document.querySelectorAll('.btn-aprobar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            const confirmar = await window.mostrarConfirmacion('¿Estás seguro de aprobar este anuncio?');
            if (!confirmar) return;

            try {
                const res = await fetch(`/${id}/aprobar`, { method: 'POST' });
                if (res.ok) {
                    btn.closest('.anuncio-card')?.remove();
                    actualizarContadorRestar();
                    await window.mostrarMensaje('✅ Anuncio aprobado correctamente');
                } else {
                    await window.mostrarMensaje('❌ Error al aprobar el anuncio');
                }
            } catch (err) {
                console.error('Error al aprobar:', err);
                await window.mostrarMensaje('❌ Error al aprobar el anuncio');
            }
        });
    });

    document.querySelectorAll('.btn-rechazar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            const motivo = await window.pedirMotivo('Indica el motivo del rechazo:');
            if (motivo === null) return;

            try {
                const res = await fetch(`/${id}/rechazar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ motivo })
                });

                if (res.ok) {
                    btn.closest('.anuncio-card')?.remove();
                    actualizarContadorRestar();
                    await window.mostrarMensaje('✅ Anuncio rechazado correctamente');
                } else {
                    await window.mostrarMensaje('❌ Error al rechazar el anuncio');
                }
            } catch (err) {
                console.error('Error al rechazar:', err);
                await window.mostrarMensaje('❌ Error al rechazar el anuncio');
            }
        });
    });
}

// --------------------------------------------------
// Esta función contiene toda la parte que me diste
// Carrusel de imágenes, notificaciones, favoritos y anuncios publicados
// --------------------------------------------------

function inicializarCarruselYNotificaciones() {
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

    // --------------------------------------------------
    // Notificaciones
    // --------------------------------------------------

    const notificacionesDiv = document.getElementById('notificaciones');
    if (!notificacionesDiv) {
        console.warn('No se encontró el div de notificaciones');
        return;
    }
    const usuarioId = notificacionesDiv.getAttribute('data-user-id');
    const lista = document.getElementById('lista-notificaciones');
    const badge = document.querySelector('#btn-notificaciones .badge');

    if (!usuarioId) {
        console.error('No se encontró el ID del usuario.');
        if (lista) lista.innerHTML = '<li>Error: usuario no identificado.</li>';
        return;
    }

    function actualizarBadge(notificaciones) {
        if (!badge) return;
        const noLeidasCount = notificaciones.filter(n => !n.leida).length;
        badge.textContent = noLeidasCount;
        badge.style.display = noLeidasCount > 0 ? 'inline-block' : 'none';
    }

    function mostrarModal(mensaje) {
        alert(mensaje);
    }

    function marcarComoLeida(noti, item, notificaciones) {
        fetch(`/notificaciones/${noti.id}/leer`, {
            method: 'POST'
        })
            .then(res => {
                if (res.ok) {
                    noti.leida = true;
                    item.classList.remove('noti-no-leida');
                    const botonLeer = item.querySelector('.btn-marcar-leida');
                    if (botonLeer) botonLeer.style.display = 'none';
                    actualizarBadge(notificaciones);
                } else {
                    mostrarModal('Error al marcar la notificación como leída');
                }
            })
            .catch(err => {
                console.error('Error al marcar notificación leída:', err);
                mostrarModal('Error al marcar la notificación como leída');
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

    // --------------------------------------------------
    // Favoritos
    // --------------------------------------------------

    function cargarFavoritos() {
        const listaFavoritos = document.getElementById('lista-favoritos');
        listaFavoritos.innerHTML = '<p>Cargando favoritos...</p>';

        fetch('/api/favoritos', {credentials: 'include'})
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

    // --------------------------------------------------
    // Anuncios publicados
    // --------------------------------------------------

    function cargarAnunciosPublicados() {
        const contenedor = document.getElementById('anunciosPublicados');
        contenedor.innerHTML = '<p>Cargando anuncios publicados...</p>';

        fetch('/anuncios/aprobados/usuario', {credentials: 'include'})
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

    // --------------------------------------------------
    // Navegación entre secciones
    // --------------------------------------------------

    const buttons = document.querySelectorAll('#menu-secciones button');
    const sections = document.querySelectorAll('section');

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

    // Cargar anuncios publicados inicialmente
    cargarAnunciosPublicados();

}
