fetch('/components/modal.html')
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);

        const modalOverlay = document.getElementById('info-modal-overlay');
        const modalMessage = document.getElementById('modal-message');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        function mostrarModal(mensaje) {
            return new Promise((resolve) => {
                modalMessage.textContent = mensaje;
                modalOverlay.classList.remove('hidden');

                function cerrar() {
                    modalOverlay.classList.add('hidden');
                    modalCloseBtn.removeEventListener('click', cerrar);
                    modalOverlay.removeEventListener('click', overlayClick);
                    resolve();  // Resolvemos la promesa cuando se cierre
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

        // Hacemos global la función para que pueda usarse con await
        window.mostrarModal = mostrarModal;
    })
    .catch(err => console.error('Error cargando modal:', err));
