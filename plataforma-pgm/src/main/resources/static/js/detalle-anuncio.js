document.addEventListener("DOMContentLoaded", () => {
    const btnFavorito = document.getElementById('btnFavorito');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const images = document.querySelectorAll('.carousel-image');
    let isFavorito = false;
    let currentIndex = 0;

    // Función para mostrar la imagen actual
    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }

    // Muestra la primera imagen inicialmente
    if (images.length > 0) {
        showImage(currentIndex);
    }

    // Botón favoritos toggle
    btnFavorito.addEventListener('click', () => {
        isFavorito = !isFavorito;
        btnFavorito.classList.toggle('active', isFavorito);
    });

    // Botón anterior
    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    // Botón siguiente
    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });
});

const modal = document.getElementById('modalCarrusel');
const modalImg = document.getElementById('imagen-modal');
const closeBtn = modal?.querySelector('.close-modal');
const prevBtn = document.getElementById('prev-img');
const nextBtn = document.getElementById('next-img');

if (document.querySelector('.img-thumb')) {
    let images = [];
    let currentIndex = 0;
    let zoomed = false;

    document.querySelectorAll('.img-thumb').forEach(img => {
        img.addEventListener('click', (e) => {
            const clickedImg = e.target;
            const anuncioDiv = clickedImg.closest('.anuncio-card');

            images = Array.from(anuncioDiv.querySelectorAll('.img-thumb')).map(i => i.src);
            currentIndex = images.indexOf(clickedImg.src);

            modalImg.src = images[currentIndex];
            modal.style.display = 'flex';

            zoomed = false;
            modalImg.classList.remove('zoomed');
            resetZoom();
        });
    });

    prevBtn?.addEventListener('click', () => {
        if (images.length === 0) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex];
        zoomed = false;
        modalImg.classList.remove('zoomed');
        resetZoom();
    });

    nextBtn?.addEventListener('click', () => {
        if (images.length === 0) return;
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex];
        zoomed = false;
        modalImg.classList.remove('zoomed');
        resetZoom();
    });

    closeBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
        modalImg.src = '';
        images = [];
        zoomed = false;
        modalImg.classList.remove('zoomed');
        resetZoom();
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalImg.src = '';
            images = [];
            zoomed = false;
            modalImg.classList.remove('zoomed');
            resetZoom();
        }
    });

    modalImg?.addEventListener('click', (e) => {
        zoomed = !zoomed;
        if (zoomed) {
            modalImg.classList.add('zoomed');
            moveZoom(e);
        } else {
            modalImg.classList.remove('zoomed');
            resetZoom();
        }
    });

    modalImg?.addEventListener('mousemove', (e) => {
        if (!zoomed) return;
        moveZoom(e);
    });

    function moveZoom(e) {
        const rect = modalImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        modalImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        modalImg.style.transform = 'scale(2)';
    }

    function resetZoom() {
        modalImg.style.transformOrigin = 'center center';
        modalImg.style.transform = 'scale(1)';
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const btnFavorito = document.getElementById('btnFavorito');
    const anuncioId = btnFavorito.getAttribute('data-anuncio-id');

    // Consultar si es favorito para pintar el botón
    fetch(`/api/favoritos/${anuncioId}/esFavorito`, { credentials: 'include' })
        .then(res => {
            if (!res.ok) throw new Error('No autorizado o error en consulta');
            return res.json();
        })
        .then(isFav => {
            isFavorito = isFav;  // <-- Aquí actualizas la variable
            btnFavorito.classList.toggle('active', isFav);
            btnFavorito.setAttribute('aria-pressed', isFav.toString());
        })
        .catch(console.error);

    btnFavorito.addEventListener('click', () => {
        if (!isFavorito) {
            fetch(`/api/favoritos/${anuncioId}`, {
                method: 'POST',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'include'
            })
                .then(res => {
                    if (res.ok) {
                        isFavorito = true;
                        btnFavorito.classList.add('active');
                        btnFavorito.setAttribute('aria-pressed', 'true');
                    } else {
                        mostrarModal('Error al añadir favorito');
                    }
                });
        } else {
            fetch(`/api/favoritos/${anuncioId}`, {
                method: 'DELETE',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'include'
            })
                .then(res => {
                    if (res.ok) {
                        isFavorito = false;
                        btnFavorito.classList.remove('active');
                        btnFavorito.setAttribute('aria-pressed', 'false');
                    } else {
                        mostrarModal('Error al quitar favorito');
                    }
                });
        }
    });
});



