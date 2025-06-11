document.addEventListener("DOMContentLoaded", () => {
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

    const contenedorAnuncios = document.querySelector(".grid.ads");

    // Toggle panel filtros
    btnFiltro.addEventListener("click", () => {
        filterDropdown.classList.toggle("open");
    });

    // Cerrar panel filtros
    btnCerrarFiltro.addEventListener("click", () => {
        filterDropdown.classList.remove("open");
    });

    // Carga anuncios aprobados desde endpoint y actualiza la vista con tu HTML
    async function cargarAnunciosAprobados() {
        try {
            const res = await fetch('/anuncios/aprobados');
            if (!res.ok) throw new Error('Error al cargar anuncios aprobados');
            const anuncios = await res.json();

            if (!contenedorAnuncios) return;

            contenedorAnuncios.innerHTML = ""; // limpiar anuncios actuales

            if (anuncios.length === 0) {
                contenedorAnuncios.innerHTML = "<p>No hay anuncios aprobados disponibles.</p>";
                return;
            }

            anuncios.forEach(anuncio => {
                // Crear estructura similar a la que usas en Thymeleaf, pero en JS:
                const a = document.createElement('a');
                a.className = "cardAd";
                a.href = `/anuncio/${anuncio.id}`;

                const divImage = document.createElement('div');
                divImage.className = "imageAd";
                const img = document.createElement('img');
                img.alt = "Imagen anuncio";
                img.src = (anuncio.imagenes && anuncio.imagenes.length > 0) ? anuncio.imagenes[0].urlImagen : "/img/default.jpg";
                divImage.appendChild(img);

                const divFooter = document.createElement('div');
                divFooter.className = "footerAd";
                divFooter.textContent = anuncio.titulo || "Título Anuncio";

                const divPrice = document.createElement('div');
                divPrice.className = "priceAd";
                divPrice.textContent = anuncio.precioFormateado || "";

                const divStatus = document.createElement('div');
                divStatus.className = "statusAd";
                divStatus.textContent = (anuncio.estadoArticulo && anuncio.estadoArticulo.nombre) ? anuncio.estadoArticulo.nombre : "Sin estado";

                const divLocation = document.createElement('div');
                divLocation.className = "locationAd";
                divLocation.textContent = anuncio.ubicacion || "";

                // Agregar todos los divs al enlace
                a.appendChild(divImage);
                a.appendChild(divFooter);
                a.appendChild(divPrice);
                a.appendChild(divStatus);
                a.appendChild(divLocation);

                contenedorAnuncios.appendChild(a);
            });
        } catch (error) {
            console.error(error);
            if (contenedorAnuncios) {
                contenedorAnuncios.innerHTML = "<p>Error cargando anuncios aprobados.</p>";
            }
        }
    }

    // Actualiza etiquetas de filtros activos (tu código original)
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

        if (!categoriasIds.length || categoriasIds.includes("all")) {
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

        categoriasIds.forEach(id => {
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
            // Aquí podrías recargar anuncios con filtros aplicados si quieres
            // cargarAnunciosAprobados();
        });
    });

    // Botón borrar filtros
    btnBorrarFiltros.addEventListener("click", () => {
        checkboxes.forEach(cb => {
            cb.checked = (cb.value === "all");
        });

        if (searchInput) searchInput.value = "";

        ordenRadios.forEach(radio => {
            radio.checked = false;
        });

        manageCheckboxes();
        updateActiveFilters();

        // Recarga anuncios sin filtros
        cargarAnunciosAprobados();
    });

    // Inicializar estado y cargar anuncios al inicio
    manageCheckboxes();
    updateActiveFilters();
    cargarAnunciosAprobados();
});
