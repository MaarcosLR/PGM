document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.grid.ads');
    const btnFiltro = document.getElementById("btnFiltro");
    const filterDropdown = document.getElementById("filterDropdown");
    const activeFiltersContainer = document.getElementById("activeFilters");
    const btnCerrarFiltro = document.getElementById("btnCerrarFiltro");
    const btnBorrarFiltros = document.getElementById("btnBorrarFiltros");
    const searchForm = document.getElementById("searchForm");
    const searchInput = searchForm.querySelector('input[name="busqueda"]');
    const ordenRadios = searchForm.querySelectorAll('input[name="orden"]');
    const moneda = 'EUR';

    let checkboxes = [];
    let allCheckbox;

    // Carga dinámicamente las categorías desde el backend
    function cargarCategorias() {
        fetch('/categorias')
            .then(response => response.json())
            .then(categorias => {
                filterDropdown.innerHTML = '';

                // Crear opción "Todas"
                const labelAll = document.createElement("label");
                labelAll.innerHTML = `
                    <input type="checkbox" name="categoriaId" value="all" checked />
                    Todas
                `;
                filterDropdown.appendChild(labelAll);

                // Agregar categorías dinámicas
                categorias.forEach(cat => {
                    const label = document.createElement("label");
                    label.innerHTML = `
                        <input type="checkbox" name="categoriaId" value="${cat.id}" />
                        ${cat.nombre}
                    `;
                    filterDropdown.appendChild(label);
                });

                initFiltros();
            })
            .catch(err => {
                console.error("Error al cargar categorías:", err);
            });
    }

    // Inicializa listeners y estados después de cargar categorías
    function initFiltros() {
        checkboxes = filterDropdown.querySelectorAll('input[name="categoriaId"]');
        allCheckbox = filterDropdown.querySelector('input[name="categoriaId"][value="all"]');

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

        manageCheckboxes();
        updateActiveFilters();
        cargarAnuncios();
    }

    // Carga anuncios desde el backend con filtros
    function cargarAnuncios() {
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
            categoriasSeleccionadas.forEach(cat => params.append('categoriaId', cat));
        } else {
            params.append('categoriaId', 'all');
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

    // Muestra los filtros activos como etiquetas
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
            if (cb.value !== "all") catMap[cb.value] = cb.nextSibling.textContent.trim();
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

    // Maneja la lógica de selección "Todas" vs específicas
    function manageCheckboxes() {
        const checked = Array.from(checkboxes).filter(cb => cb.checked && cb.value !== "all");
        allCheckbox.checked = checked.length === 0;
    }

    // Panel de filtros: abrir/cerrar
    btnFiltro.addEventListener("click", () => {
        filterDropdown.classList.toggle("open");
    });

    btnCerrarFiltro.addEventListener("click", () => {
        filterDropdown.classList.remove("open");
    });

    // Buscar sin recargar
    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        cargarAnuncios();
    });

    // Orden
    ordenRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            cargarAnuncios();
        });
    });

    // Borrar filtros
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

    // Inicialización general
    cargarCategorias();
});
