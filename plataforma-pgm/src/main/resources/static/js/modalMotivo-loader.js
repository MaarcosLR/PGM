fetch('/components/modalMotivo.html')
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);

        const modalOverlay = document.getElementById('text-modal-overlay');
        const modalTextarea = document.getElementById('modal-textarea');
        const modalSubmitBtn = document.getElementById('modal-submit-btn');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        function mostrarModalTexto() {
            return new Promise((resolve, reject) => {
                modalTextarea.value = '';
                modalOverlay.classList.remove('hidden');
                modalTextarea.focus();

                function cerrar() {
                    modalOverlay.classList.add('hidden');
                    modalSubmitBtn.removeEventListener('click', enviar);
                    modalCloseBtn.removeEventListener('click', cancelar);
                    modalOverlay.removeEventListener('click', overlayClick);
                }

                function enviar() {
                    const valor = modalTextarea.value.trim();
                    if (valor === '') {
                        alert('Debes escribir un motivo.');
                        return;
                    }
                    cerrar();
                    resolve(valor);
                }

                function cancelar() {
                    cerrar();
                    resolve(null);  // El usuario canceló
                }

                function overlayClick(e) {
                    if (e.target === modalOverlay) {
                        cancelar();
                    }
                }

                modalSubmitBtn.addEventListener('click', enviar);
                modalCloseBtn.addEventListener('click', cancelar);
                modalOverlay.addEventListener('click', overlayClick);
            });
        }

        window.mostrarModalTexto = mostrarModalTexto;
    })
    .catch(err => console.error('Error cargando modal:', err));
