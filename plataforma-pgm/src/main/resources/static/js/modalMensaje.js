function mostrarModalMensaje(mensaje, conInput = false) {
    return new Promise(resolve => {
        const modal = document.getElementById('modalMensaje');
        const texto = document.getElementById('modalMensaje-text');
        const btnCerrar = document.getElementById('modalMensaje-close');
        const input = document.getElementById('modalMensaje-input');

        texto.textContent = mensaje;

        if (conInput) {
            input.style.display = 'block';
            input.value = '';
            input.focus();
            btnCerrar.textContent = 'Aceptar';
        } else {
            input.style.display = 'none';
            btnCerrar.textContent = 'Cerrar';
        }

        modal.style.display = 'flex';

        function cerrar() {
            modal.style.display = 'none';
            btnCerrar.removeEventListener('click', cerrar);
            resolve(conInput ? input.value.trim() : undefined);
        }

        btnCerrar.addEventListener('click', cerrar);
    });
}
