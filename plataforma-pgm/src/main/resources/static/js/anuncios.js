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

    function getSelectedOrden() {
        const selected = Array.from(ordenRadios).find(r => r.checked);
        return selected ? selected.value : null;
    }

    function cargarAnuncios() {
        const categoriasSeleccionadas = Array.from(checkboxes)
            .filter(cb => cb.checked && cb.value !== "all")
            .map(cb => cb.value);

        const busqueda = searchInput?.value?.trim();
        const orden = getSelectedOrden();
        const moneda = "EUR"; // puedes obtenerla dinámicamente si lo necesitas

        const params = new URLSearchParams();

        if (categoriasSeleccionadas.length) {
            categoriasSeleccionadas.forEach(cat => params.append('categorias', cat));
        }

        if (busqueda) params.append('busqueda', busqueda);
        if (orden) params.append('orden', orden);
        params.append('moneda', moneda);

        fetch(`/api/anuncios/buscar?${params.toString()}`)
            .then(response => response.json())
            .then(anuncios => {
                container.innerHTML = '';

                if (!anuncios.length) {
                    container.innerHTML = '<p>No se encontraron anuncios.</p>';
                    return;
                }

                anuncios.forEach(anuncio => {
                    const card = document.createElement('a');
                    card.classList.add('tarjetaAnuncio');
                    card.href = `/anuncio/${anuncio.id}`;
                    card.innerHTML = `
                        <div class="imagenAnuncio">
                            <img src="${anuncio.imagenes?.[0]?.urlImagen || '/img/default.jpg'}" alt="Imagen anuncio" />
                        </div>
                        <div class="pieAnuncio">${anuncio.titulo}</div>
                        <div class="precioAnuncio">${anuncio.precioFormateado}</div>
                        <div class="estadoAnuncio">${anuncio.estadoArticulo?.nombre || 'Sin estado'}</div>
                        <div class="localizacionAnuncio">${anuncio.ubicacion}</div>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error al cargar anuncios:', error);
                container.innerHTML = '<p>Error al cargar los anuncios.</p>';
            });
    }

    function updateActiveFilters() {
        activeFiltersContainer.innerHTML = "";

        const seleccionadas = Array.from(checkboxes)
            .filter(cb => cb.checked && cb.value !== "all")
            .map(cb => cb.value);

        if (!seleccionadas.length) {
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

        seleccionadas.forEach(id => {
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

    function manageCheckboxes() {
        const checked = Array.from(checkboxes).filter(cb => cb.checked && cb.value !== "all");
        allCheckbox.checked = checked.length === 0;
    }

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

    btnBorrarFiltros.addEventListener("click", () => {
        checkboxes.forEach(cb => cb.checked = cb.value === "all");
        if (searchInput) searchInput.value = "";
        ordenRadios.forEach(r => r.checked = false);
        manageCheckboxes();
        updateActiveFilters();
        cargarAnuncios();
    });

    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        cargarAnuncios();
    });

    btnFiltro.addEventListener("click", () => filterDropdown.classList.toggle("open"));
    btnCerrarFiltro.addEventListener("click", () => filterDropdown.classList.remove("open"));

    // Inicializar
    manageCheckboxes();
    updateActiveFilters();
    cargarAnuncios();
});
