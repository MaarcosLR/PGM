document.getElementById('registroForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // evitar submit tradicional

    const data = {
        nombre: this.nombre.value,
        correoElectronico: this.correoElectronico.value,
        contrasena: this.contrasena.value
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Aquí asumimos que backend responde con JSON con mensaje éxito
            const result = await response.json();
            document.getElementById('mensaje').style.color = '#0079a6';
            document.getElementById('mensaje').textContent = result.message || 'Usuario registrado correctamente';
            this.reset();
            setTimeout(() => window.location.href = '/login.html', 500);
        } else {
            const errorResult = await response.json();
            document.getElementById('mensaje').style.color = 'red';
            document.getElementById('mensaje').textContent = errorResult.message || 'Error en el registro';
        }
    } catch (error) {
        document.getElementById('mensaje').style.color = 'red';
        document.getElementById('mensaje').textContent = 'Error de conexión al servidor';
    }
});
