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

    if (!profilePhoto.src || profilePhoto.src === window.location.href) {
        profilePhoto.src = defaultPhoto;
    }

    profilePhotoWrapper.addEventListener('click', e => {
        e.stopPropagation();
        if(photoMenu.style.display === 'block'){
            photoMenu.style.display = 'none';
        } else {
            const rect = profilePhotoWrapper.getBoundingClientRect();
            photoMenu.style.top = rect.bottom + window.scrollY + 5 + 'px';
            photoMenu.style.left = rect.left + window.scrollX + 'px';
            photoMenu.style.display = 'block';
        }
    });

    document.addEventListener('click', () => {
        photoMenu.style.display = 'none';
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = e => {
                profilePhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('change-photo-btn').addEventListener('click', () => {
        fileInput.click();
        photoMenu.style.display = 'none';
    });

    document.getElementById('remove-photo-btn').addEventListener('click', () => {
        profilePhoto.src = defaultPhoto;
        fileInput.value = '';
        photoMenu.style.display = 'none';
    });

    // --------- País y ciudades ---------
    const ciudadesPorPais = {
        "España": [
            "Selecciona una ciudad...","Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza",
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
    // Simula que tienes el usuario en una variable global o inyectada desde backend:
    // En Spring podrías inyectar con Thymeleaf:
    // <script>const usuario = [[${usuario}]];</script>
    const usuario = window.usuarioLogueado || {
        nombre: '',
        correoElectronico: '',
        telefono: '',
        pais: '',
        ciudad: '',
        fotoPerfil: '', // url o base64
    };

    // Rellenar campos del formulario
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

        // Agregar foto solo si hay archivo seleccionado
        const fileInput = document.getElementById('foto');
        if (fileInput.files.length > 0) {
            formData.append('foto', fileInput.files[0]);
        }

        fetch('/api/usuario/actualizar', {
            method: 'POST',
            body: formData,
            credentials: 'include'  // si usas sesión/cookies
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    alert('Error: ' + data.error);
                } else {
                    alert('Datos guardados correctamente');
                    // Opcional: actualizar `window.usuarioLogueado` con data.usuario y refrescar UI
                    window.usuarioLogueado = data.usuario;
                }
            })
            .catch(err => {
                alert('Error guardando datos: ' + err.message);
            });
    });

});
