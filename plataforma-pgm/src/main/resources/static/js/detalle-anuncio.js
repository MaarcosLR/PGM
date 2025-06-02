document.addEventListener("DOMContentLoaded", () => {
    const btnFavorito = document.getElementById('btnFavorito');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const images = document.querySelectorAll('.carousel-image');
    let isFavorito = false; // Estado inicial
    let currentIndex = 0;
    let intervalId;

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

    // Autoplay
    function startAutoPlay() {
        intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }, 3000);
    }

    function stopAutoPlay() {
        clearInterval(intervalId);
    }

    startAutoPlay();

    // Botón favoritos toggle
    btnFavorito.addEventListener('click', () => {
        isFavorito = !isFavorito;
        btnFavorito.classList.toggle('active', isFavorito);
        // Aquí mandar al backend con fetch/AJAX si quieres
    });

    // Botón anterior
    btnPrev.addEventListener('click', () => {
        stopAutoPlay();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
        startAutoPlay();
    });

    // Botón siguiente
    btnNext.addEventListener('click', () => {
        stopAutoPlay();
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
        startAutoPlay();
    });
});
