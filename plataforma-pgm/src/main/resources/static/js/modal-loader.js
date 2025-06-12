document.addEventListener('DOMContentLoaded', () => {
    const modalMessage = document.getElementById('modal-message');
    const modalOverlay = document.getElementById('modal-overlay');
    const btnConfirm = document.getElementById('modal-confirm-btn');
    const btnCancel = document.getElementById('modal-cancel-btn');
    const btnSend = document.getElementById('modal-send-btn');
    const btnCloseSimple = document.getElementById('modal-close-btn-simple');

    if (!modalMessage || !modalOverlay) {
        console.error('⚠️ Elementos del modal no encontrados en el DOM. Verifica el HTML.');
        return;
    }

    window.mostrarModal = function (mensaje, options = {}) {
        return new Promise((resolve) => {
            modalMessage.innerHTML = '';
            [btnConfirm, btnCancel, btnSend, btnCloseSimple].forEach(btn => {
                if (btn) btn.classList.add('hidden');
            });

            const cleanBtn = (btn) => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                return newBtn;
            };

            const btnConfirmClean = btnConfirm ? cleanBtn(btnConfirm) : null;
            const btnCancelClean = btnCancel ? cleanBtn(btnCancel) : null;
            const btnSendClean = btnSend ? cleanBtn(btnSend) : null;
            const btnCloseSimpleClean = btnCloseSimple ? cleanBtn(btnCloseSimple) : null;

            modalOverlay.classList.remove('hidden');

            const cerrar = () => {
                modalOverlay.classList.add('hidden');
            };

            if (options.conInput) {
                const msg = document.createElement('p');
                msg.textContent = mensaje;

                const textarea = document.createElement('textarea');
                textarea.id = 'modal-textarea';
                textarea.placeholder = options.placeholder || 'Escribe aquí...';
                textarea.classList.add('modal-textarea');

                modalMessage.appendChild(msg);
                modalMessage.appendChild(textarea);

                if (btnSendClean) {
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
                }

                if (btnCancelClean) {
                    btnCancelClean.classList.remove('hidden');
                    btnCancelClean.onclick = () => {
                        cerrar();
                        resolve(null);
                    };
                }

                modalOverlay.onclick = (e) => {
                    if (e.target === modalOverlay) {
                        cerrar();
                        resolve(null);
                    }
                };

                return;
            }

            if (options.type === 'confirm') {
                modalMessage.textContent = mensaje;

                if (btnConfirmClean) {
                    btnConfirmClean.classList.remove('hidden');
                    btnConfirmClean.onclick = () => {
                        cerrar();
                        resolve(true);
                    };
                }

                if (btnCancelClean) {
                    btnCancelClean.classList.remove('hidden');
                    btnCancelClean.onclick = () => {
                        cerrar();
                        resolve(false);
                    };
                }

                modalOverlay.onclick = (e) => {
                    if (e.target === modalOverlay) {
                        cerrar();
                        resolve(false);
                    }
                };

                return;
            }

            // Simple mensaje con cerrar
            modalMessage.textContent = mensaje;
            if (btnCloseSimpleClean) {
                btnCloseSimpleClean.classList.remove('hidden');
                btnCloseSimpleClean.onclick = () => {
                    cerrar();
                    resolve();
                };
            }

            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) {
                    cerrar();
                    resolve();
                }
            };
        });
    };
});
