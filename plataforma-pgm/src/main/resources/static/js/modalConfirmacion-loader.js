// Modal de confirmación
function mostrarConfirmacion(mensaje) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('confirm-modal-overlay');
        const message = document.getElementById('confirm-modal-message');
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');

        message.textContent = mensaje;
        overlay.classList.remove('hidden');

        function cerrar() {
            overlay.classList.add('hidden');
            yesBtn.removeEventListener('click', confirmar);
            noBtn.removeEventListener('click', cancelar);
        }

        function confirmar() {
            cerrar();
            resolve(true);
        }

        function cancelar() {
            cerrar();
            resolve(false);
        }

        yesBtn.addEventListener('click', confirmar);
        noBtn.addEventListener('click', cancelar);
    });
}

// Modal de mensaje informativo (bloqueante hasta cerrar)
function mostrarMensaje(mensaje) {
    return new Promise((resolve) => {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalMessage = document.getElementById('modal-message');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        modalMessage.textContent = mensaje;
        modalOverlay.classList.remove('hidden');

        function cerrar() {
            modalOverlay.classList.add('hidden');
            modalCloseBtn.removeEventListener('click', cerrar);
            modalOverlay.removeEventListener('click', overlayClick);
            resolve();
        }

        function overlayClick(e) {
            if (e.target === modalOverlay) {
                cerrar();
            }
        }

        modalCloseBtn.addEventListener('click', cerrar);
        modalOverlay.addEventListener('click', overlayClick);
    });
}
