document.getElementById('registroForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const boton = this.querySelector('button[type="submit"]');
    const mensajeElem = document.getElementById('mensaje');

    // Deshabilitar y mostrar "Enviando..."
    boton.disabled = true;
    const textoOriginal = boton.textContent;
    boton.textContent = 'Enviando...';

    const data = {
        nombre: this.nombre.value,
        correoElectronico: this.correoElectronico.value,
        contrasena: this.contrasena.value
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            mensajeElem.style.color = '#0079a6';
            mensajeElem.textContent = result.message || 'Usuario registrado correctamente';
            this.reset();
            // restaurar botón (opcional, ya que redirige)
            boton.disabled = false;
            boton.textContent = textoOriginal;
            setTimeout(() => window.location.href = '/login.html', 500);
        } else {
            mensajeElem.style.color = 'red';
            mensajeElem.textContent = result.message || 'Error en el registro';
            // restaurar botón para intentar de nuevo
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    } catch (error) {
        mensajeElem.style.color = 'red';
        mensajeElem.textContent = 'Error de conexión al servidor';
        boton.disabled = false;
        boton.textContent = textoOriginal;
    }
});
