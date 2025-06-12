document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector('.grid.ads');
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
    const moneda = 'EUR'; // Cambia si necesitas otra moneda o dinámica

    // Carga anuncios con filtros
    function cargarAnuncios() {
        // Obtener categorías seleccionadas excepto "all"
        const categoriasSeleccionadas = Array.from(checkboxes)
            .filter(cb => cb.checked && cb.value !== "all")
            .map(cb => cb.value);

        const busqueda = searchInput.value.trim();

        let orden = null;
        ordenRadios.forEach(radio => {
            if (radio.checked) orden = radio.value;
        });

        const params = new URLSearchParams();

        if (busqueda) params.append('busqueda', busqueda);
        if (categoriasSeleccionadas.length > 0) {
            categoriasSeleccionadas.forEach(cat => params.append('categoriasId', cat));
        } else {
            // Si no hay categorías seleccionadas, enviamos 'all' para que backend entienda que es todo
            params.append('categorias', 'all');
        }
        if (orden) params.append('orden', orden);
        if (moneda) params.append('moneda', moneda);

        fetch('/api/anuncios/mostrarAnuncios?' + params.toString())
            .then(response => response.json())
            .then(anuncios => {
                container.innerHTML = '';

                anuncios.forEach(anuncio => {
                    const card = document.createElement('a');
                    card.classList.add('tarjetaAnuncio');
                    card.href = `/anuncio/${anuncio.id}`;
                    card.innerHTML = `
                        <div class="imagenAnuncio">
                            <img src="${anuncio.imagenPrincipalUrl || '/img/default.jpg'}" alt="Imagen anuncio" />
                        </div>
                        <div class="pieAnuncio">${anuncio.titulo}</div>
                        <div class="precioAnuncio">${anuncio.precioFormateado}</div>
                        <div class="estadoAnuncio">${anuncio.estadoArticulo ? anuncio.estadoArticulo.nombre : 'Sin estado'}</div>
                        <div class="localizacionAnuncio">${anuncio.ubicacion}</div>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error al cargar anuncios:', error);
            });
    }

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

        const categoriasSeleccionadas = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes("all")) {
            const tag = document.createElement("div");
            tag.className = "active-filter-tag";
            tag.textContent = "Todas las categorías";
            activeFiltersContainer.appendChild(tag);
            return;
        }

        const catMap = {};
        checkboxes.forEach(cb => {
            if (cb.value !== "all") catMap[cb.value] = cb.nextElementSibling.textContent;
        });

        categoriasSeleccionadas.forEach(id => {
            if (id === "all") return;
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
                    cargarAnuncios();
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

    // Escucha cambios en checkboxes y aplica lógica + recarga anuncios
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
            cargarAnuncios();
        });
    });

    // Escuchar submit del formulario de búsqueda para cargar anuncios sin recargar
    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        cargarAnuncios();
    });

    // Escuchar cambios de orden para recargar anuncios
    ordenRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            cargarAnuncios();
        });
    });

    // Botón borrar filtros
    btnBorrarFiltros.addEventListener("click", () => {
        checkboxes.forEach(cb => {
            cb.checked = (cb.value === "all");
        });
        searchInput.value = "";
        ordenRadios.forEach(radio => {
            radio.checked = false;
        });

        manageCheckboxes();
        updateActiveFilters();
        cargarAnuncios();
    });

    // Inicialización
    manageCheckboxes();
    updateActiveFilters();
    cargarAnuncios();
});
