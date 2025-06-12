const modalMessage = document.getElementById('modal-message');
const modalOverlay = document.getElementById('modal-overlay');
const btnConfirm = document.getElementById('modal-confirm-btn');
const btnCancel = document.getElementById('modal-cancel-btn');
const btnSend = document.getElementById('modal-send-btn');
const btnCloseSimple = document.getElementById('modal-close-btn-simple');

function mostrarModal(mensaje, options = {}) {
    return new Promise((resolve) => {
        // Reset modal content and hide all buttons
        modalMessage.innerHTML = '';
        [btnConfirm, btnCancel, btnSend, btnCloseSimple].forEach(btn => btn.classList.add('hidden'));

        // Remove previous event listeners by cloning buttons (simple trick)
        const cleanBtn = (btn) => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            return newBtn;
        };

        // Re-assign cleaned buttons with no listeners
        const btnConfirmClean = cleanBtn(btnConfirm);
        const btnCancelClean = cleanBtn(btnCancel);
        const btnSendClean = cleanBtn(btnSend);
        const btnCloseSimpleClean = cleanBtn(btnCloseSimple);

        modalOverlay.classList.remove('hidden');

        // Función para cerrar modal y limpiar
        function cerrar() {
            modalOverlay.classList.add('hidden');
        }

        // Caso con textarea + botón enviar
        if (options.conInput) {
            const msg = document.createElement('p');
            msg.textContent = mensaje;
            const textarea = document.createElement('textarea');
            textarea.id = 'modal-textarea';
            textarea.placeholder = options.placeholder || 'Escribe aquí...';
            textarea.classList.add('modal-textarea');

            modalMessage.appendChild(msg);
            modalMessage.appendChild(textarea);

            btnSendClean.classList.remove('hidden');
            btnSendClean.onclick = () => {
                const value = textarea.value.trim();
                if (value) {
                    cerrar();
                    resolve(value);
                } else {
                    alert('Debe ingresar un motivo.');
                }
            };

            btnCancelClean.classList.remove('hidden');
            btnCancelClean.onclick = () => {
                cerrar();
                resolve(null);
            };

            // Cerrar con clic fuera del modal
            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) {
                    cerrar();
                    resolve(null);
                }
            };

            return; // termina aquí el flujo con textarea
        }

        // Caso confirm (Sí/No)
        if (options.type === 'confirm') {
            modalMessage.textContent = mensaje;
            btnConfirmClean.classList.remove('hidden');
            btnCancelClean.classList.remove('hidden');

            btnConfirmClean.onclick = () => {
                cerrar();
                resolve(true);
            };

            btnCancelClean.onclick = () => {
                cerrar();
                resolve(false);
            };

            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) {
                    cerrar();
                    resolve(false);
                }
            };

            return;
        }

        // Caso mensaje simple con botón cerrar
        modalMessage.textContent = mensaje;
        btnCloseSimpleClean.classList.remove('hidden');
        btnCloseSimpleClean.onclick = () => {
            cerrar();
            resolve();
        };

        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                cerrar();
                resolve();
            }
        };
    });
}
