function mostrarModalMensaje(mensaje) {
    return new Promise(resolve => {
        const modal = document.getElementById('modalMensaje');
        const texto = document.getElementById('modalMensaje-text');
        const btnCerrar = document.getElementById('modalMensaje-close');

        texto.textContent = mensaje;
        modal.style.display = 'flex';

        function cerrar() {
            modal.style.display = 'none';
            btnCerrar.removeEventListener('click', cerrar);
            resolve();
        }

        btnCerrar.addEventListener('click', cerrar);
    });
}
