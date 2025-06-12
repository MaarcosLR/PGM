document.addEventListener("DOMContentLoaded", () => {

    fetch('/api/anuncios/mostrarAnuncios')
        .then(response => response.json())
        .then(anuncios => {
            const container = document.querySelector('.grid.ads');
            container.innerHTML = ''; // Limpia contenido

            anuncios.forEach(anuncio => {
                const card = document.createElement('a');
                card.classList.add('cardAd');
                card.href = `/anuncio/${anuncio.id}`;
                card.innerHTML = `
          <div class="imageAd">
            <img src="${anuncio.imagenes.length ? anuncio.imagenes[0].urlImagen : '/img/default.jpg'}" alt="Imagen anuncio" />
          </div>
          <div class="footerAd">${anuncio.titulo}</div>
          <div class="priceAd">${anuncio.precioFormateado}</div>
          <div class="statusAd">${anuncio.estadoArticulo ? anuncio.estadoArticulo.nombre : 'Sin estado'}</div>
          <div class="locationAd">${anuncio.ubicacion}</div>
        `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al cargar anuncios:', error);
        });

    const btnFiltro = document.getElementById("btnFiltro");
    const filterDropdown = document.getElementById("filterDropdown");
    const activeFiltersContainer = document.getElementById("activeFilters");
    const checkboxes = filterDropdown.querySelectorAll('input[name="categoriaId"]');
    const allCheckbox = filterDropdown.querySelector('input[name="categoriaId"][value="all"]');
    const btnCerrarFiltro = document.getElementById("btnCerrarFiltro");
    const btnBorrarFiltros = document.getElementById("btnBorrarFiltros");
    const searchForm = document.getElementById("searchForm");
    const searchInput = searchForm.querySelector('input[name="busqueda"]');
    const ordenRadios = searchForm.querySelectorAll('input[name="orden"]');

    // Toggle panel filtros
    btnFiltro.addEventListener("click", () => {
        filterDropdown.classList.toggle("open");
    });

    // Cerrar panel filtros
    btnCerrarFiltro.addEventListener("click", () => {
        filterDropdown.classList.remove("open");
    });

    // Actualiza etiquetas de filtros activos
    function updateActiveFilters() {
        activeFiltersContainer.innerHTML = "";

        const categoriasSeleccionadas = activeFiltersContainer.getAttribute("data-categorias");
        let categoriasIds = [];

        if (categoriasSeleccionadas && categoriasSeleccionadas !== "null") {
            try {
                categoriasIds = JSON.parse(categoriasSeleccionadas.replace(/'/g, '"'));
            } catch {
                categoriasIds = categoriasSeleccionadas.split(",");
            }
        }

        // Si no hay categorías seleccionadas o está "all", mostramos "Todas las categorías"
        if (!categoriasIds.length || categoriasIds.includes("all")) {
            const tag = document.createElement("div");
            tag.className = "active-filter-tag";
            tag.textContent = "Todas las categorías"; // Mostrar texto legible
            // No pongo botón de eliminar porque quitar "Todas las categorías" no tiene sentido (es el estado base)
            activeFiltersContainer.appendChild(tag);
            return;
        }

        const catMap = {};
        checkboxes.forEach(cb => {
            if (cb.value !== "all") catMap[cb.value] = cb.nextElementSibling.textContent;
        });

        categoriasIds.forEach(id => {
            if (id === "all") return; // Ya gestionado arriba
            const tag = document.createElement("div");
            tag.className = "active-filter-tag";
            tag.textContent = catMap[id] || id;

            const removeBtn = document.createElement("span");
            removeBtn.className = "remove-btn";
            removeBtn.textContent = "×";
            removeBtn.title = "Quitar filtro";

            removeBtn.addEventListener("click", () => {
                const input = filterDropdown.querySelector(`input[name="categoriaId"][value="${id}"]`);
                if (input) {
                    input.checked = false;
                    manageCheckboxes();
                    updateActiveFilters();
                }
            });

            tag.appendChild(removeBtn);
            activeFiltersContainer.appendChild(tag);
        });
    }

    // Gestiona selección/deselección de checkboxes categorías
    function manageCheckboxes() {
        const checked = Array.from(checkboxes).filter(cb => cb.checked && cb.value !== "all");

        if (checked.length > 0) {
            allCheckbox.checked = false;
        } else {
            allCheckbox.checked = true;
        }
    }

    // Escucha cambios en checkboxes y aplica lógica
    checkboxes.forEach(input => {
        input.addEventListener("change", () => {
            if (input.value === "all" && input.checked) {
                checkboxes.forEach(cb => {
                    if (cb.value !== "all") cb.checked = false;
                });
            } else if (input.value !== "all" && input.checked) {
                allCheckbox.checked = false;
            }

            manageCheckboxes();
            updateActiveFilters();
        });
    });

    // Botón borrar filtros
    btnBorrarFiltros.addEventListener("click", () => {
        // Seleccionar solo "all"
        checkboxes.forEach(cb => {
            cb.checked = (cb.value === "all");
        });

        // Vaciar búsqueda
        if (searchInput) searchInput.value = "";

        // Desmarcar orden
        ordenRadios.forEach(radio => {
            radio.checked = false;
        });

        // Actualizar checkboxes y etiquetas
        manageCheckboxes();
        updateActiveFilters();

        // No enviamos el formulario para evitar recarga
    });

    // Inicializar estado al cargar página
    manageCheckboxes();
    updateActiveFilters();
});

