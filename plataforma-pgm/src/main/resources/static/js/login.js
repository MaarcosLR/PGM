document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir submit tradicional

    const data = {
        correoElectronico: this.correoElectronico.value,
        contrasena: this.contrasena.value
    };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        const mensajeElem = document.getElementById('loginMensaje');

        if (response.ok) {
            mensajeElem.style.color = 'green';
            mensajeElem.textContent = result.message || 'Inicio de sesión exitoso';
            // Redirigir tras 1.5s
            setTimeout(() => window.location.href = '/anuncios.html', 1500);
        } else {
            mensajeElem.style.color = 'red';
            mensajeElem.textContent = result.message || 'Error al iniciar sesión';
        }
    } catch (error) {
        document.getElementById('loginMensaje').style.color = 'red';
        document.getElementById('loginMensaje').textContent = 'Error de conexión al servidor';
    }
});
