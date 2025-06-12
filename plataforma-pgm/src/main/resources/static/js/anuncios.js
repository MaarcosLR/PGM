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

    const categoriasContainer = filterDropdown.querySelector('.filtro-categorias ul');

    // Variables que se actualizarán tras cargar categorías
    let checkboxes = filterDropdown.querySelectorAll('input[name="categoriaId"]');
    let allCheckbox = filterDropdown.querySelector('input[name="categoriaId"][value="all"]');

    function getSelectedOrden() {
        const selected = Array.from(ordenRadios).find(r => r.checked);
        return selected ? selected.value : null;
    }

    function mostrarAnunciosEnUI(anuncios) {
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
                  <img src="${anuncio.imagenPrincipalUrl || '/img/default.jpg'}" alt="Imagen anuncio" />
                </div>
                <div class="pieAnuncio">${anuncio.titulo}</div>
                <div class="precioAnuncio">${anuncio.precioFormateado}</div>
                <div class="estadoAnuncio">${anuncio.estadoArticulo?.nombre || 'Sin estado'}</div>
                <div class="localizacionAnuncio">${anuncio.ubicacion}</div>
            `;
            container.appendChild(card);
        });
    }

    function cargarAnuncios() {
        const categoriasSeleccionadas = Array.from(checkboxes)
            .filter(cb => cb.checked && cb.value !== "all")
            .map(cb => cb.value);

        const busqueda = searchInput?.value?.trim();
        const orden = getSelectedOrden();
        const moneda = "EUR";

        const tieneFiltros = busqueda || categoriasSeleccionadas.length > 0 || orden;

        let url = '';
        let params = new URLSearchParams();

        if (tieneFiltros) {
            if (busqueda) params.append('busqueda', busqueda);
            categoriasSeleccionadas.forEach(cat => params.append('categorias', cat));
            if (orden) params.append('orden', orden);
            params.append('moneda', moneda);

            url = `/api/anuncios/buscar?${params.toString()}`;
        } else {
            url = '/api/anuncios/mostrarAnuncios';
        }

        fetch(url)
            .then(response => response.json())
            .then(anuncios => {
                mostrarAnunciosEnUI(anuncios);
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

    // Esta función enlaza los eventos change a todos los checkboxes
    function inicializarCheckboxes() {
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
    }

    // Cargar categorías desde backend y generar checkbox dinámicamente
    function cargarCategorias() {
        fetch('/categorias')
            .then(res => res.json())
            .then(categorias => {
                // Limpiar los <li> menos el primero ("Todas las Categorías")
                while (categoriasContainer.children.length > 1) {
                    categoriasContainer.removeChild(categoriasContainer.lastChild);
                }

                categorias.forEach(cat => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <label>
                            <input type="checkbox" name="categoriaId" value="${cat.id}" />
                            <span class="cat-item">${cat.nombre}</span>
                        </label>
                    `;
                    categoriasContainer.appendChild(li);
                });

                // Actualizar variables globales y enlazar eventos
                checkboxes = filterDropdown.querySelectorAll('input[name="categoriaId"]');
                allCheckbox = filterDropdown.querySelector('input[name="categoriaId"][value="all"]');
                inicializarCheckboxes();
                manageCheckboxes();
                updateActiveFilters();
            })
            .catch(err => {
                console.error('Error al cargar categorías:', err);
            });
    }

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

    // Cargar categorías y luego anuncios e inicializar controles
    cargarCategorias();
    cargarAnuncios();
});
