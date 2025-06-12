const modalMessage = document.getElementById('modal-message');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');

function mostrarModal(mensaje, conInput = false) {
    return new Promise((resolve) => {
        modalMessage.innerHTML = ''; // Clear before inserting

        if (conInput) {
            const msg = document.createElement('p');
            msg.textContent = mensaje;

            const input = document.createElement('textarea');
            input.id = 'modal-textarea';
            input.placeholder = 'Escribe aquí...';
            input.classList.add('modal-textarea');

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirmar';
            confirmBtn.classList.add('modal-confirm-btn');

            modalMessage.appendChild(msg);
            modalMessage.appendChild(input);
            modalMessage.appendChild(confirmBtn);

            confirmBtn.addEventListener('click', () => {
                const value = input.value.trim();
                if (value) {
                    cerrar();
                    resolve(value);
                } else {
                    alert('Debe ingresar un motivo.');
                }
            });
        } else {
            modalMessage.textContent = mensaje;
        }

        modalOverlay.classList.remove('hidden');

        function cerrar() {
            modalOverlay.classList.add('hidden');
            modalCloseBtn.removeEventListener('click', cerrar);
            modalOverlay.removeEventListener('click', overlayClick);
        }

        function overlayClick(e) {
            if (e.target === modalOverlay) {
                cerrar();
                resolve(null);
            }
        }

        modalCloseBtn.addEventListener('click', cerrar);
        modalOverlay.addEventListener('click', overlayClick);
    });
}
