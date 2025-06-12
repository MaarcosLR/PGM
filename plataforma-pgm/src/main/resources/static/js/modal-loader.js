document.addEventListener('DOMContentLoaded', async () => {
    try {
        await cargarModal(); // Espera a que se cargue el modal
        console.log('✅ Modal cargado correctamente');
    } catch (error) {
        console.error('❌ Error cargando el modal:', error);
    }
});

async function cargarModal() {
    const resp = await fetch('/components/modal.html'); // Asegúrate que la ruta sea correcta
    if (!resp.ok) throw new Error('No se pudo cargar el modal HTML');

    const html = await resp.text();
    document.body.insertAdjacentHTML('beforeend', html);

    // Obtener referencias a los elementos del modal
    window.modalOverlay = document.getElementById('general-modal-overlay');
    window.modalMessage = document.getElementById('modal-message');
    window.textareaLabel = document.getElementById('modal-textarea-label');
    window.modalTextarea = document.getElementById('modal-textarea');

    window.btnConfirm = document.getElementById('modal-confirm-btn');
    window.btnCancel = document.getElementById('modal-cancel-btn');
    window.btnSend = document.getElementById('modal-send-btn');
    window.btnCloseSimple = document.getElementById('modal-close-btn-simple');

    // Funciones del modal
    function resetModal() {
        window.modalMessage.textContent = '';
        window.modalTextarea.value = '';
        window.textareaLabel.classList.add('hidden');
        window.modalTextarea.classList.add('hidden');

        window.btnConfirm.classList.add('hidden');
        window.btnCancel.classList.add('hidden');
        window.btnSend.classList.add('hidden');
        window.btnCloseSimple.classList.add('hidden');
    }

    function showModal() {
        window.modalOverlay.classList.remove('hidden');
    }

    function hideModal() {
        window.modalOverlay.classList.add('hidden');
        resetModal();
    }

    window.mostrarMensaje = function(mensaje) {
        return new Promise(resolve => {
            resetModal();
            window.modalMessage.textContent = mensaje;
            window.btnCloseSimple.classList.remove('hidden');
            showModal();

            window.btnCloseSimple.onclick = () => {
                hideModal();
                resolve();
            };
        });
    };

    window.mostrarConfirmacion = function(mensaje) {
        return new Promise(resolve => {
            resetModal();
            window.modalMessage.textContent = mensaje;
            window.btnConfirm.classList.remove('hidden');
            window.btnCancel.classList.remove('hidden');
            showModal();

            window.btnConfirm.onclick = () => {
                hideModal();
                resolve(true);
            };
            window.btnCancel.onclick = () => {
                hideModal();
                resolve(false);
            };
        });
    };

    window.pedirMotivo = function(mensaje) {
        return new Promise(resolve => {
            resetModal();
            window.modalMessage.textContent = mensaje;
            window.textareaLabel.classList.remove('hidden');
            window.modalTextarea.classList.remove('hidden');
            window.btnSend.classList.remove('hidden');
            window.btnCancel.classList.remove('hidden');
            showModal();

            window.btnSend.onclick = () => {
                const texto = window.modalTextarea.value.trim();
                if (texto === '') {
                    alert('El motivo no puede estar vacío.');
                    return;
                }
                hideModal();
                resolve(texto);
            };
            window.btnCancel.onclick = () => {
                hideModal();
                resolve(null);
            };
        });
    };
}
