// ========================
// 1) CONTADOR DE CARACTERES
// ========================
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("solicitar-form");
    const btn = document.getElementById("btnEnviar");

    form.addEventListener("submit", function (e) {
        // Deshabilita el botón para evitar múltiples envíos
        btn.disabled = true;
        btn.textContent = "Enviando..."; // Opcional: cambia el texto
    });
});

const descripcion = document.getElementById("descripcion");
const charCount   = document.getElementById("char-count");

descripcion.addEventListener("input", () => {
    charCount.textContent = descripcion.value.length;
});

// ========================
// 2) MANEJO DE IMÁGENES
// ========================
const imagenesInput  = document.getElementById("imagenes");
const btnClearImages = document.getElementById("btnClearImages");

btnClearImages.addEventListener("click", () => {
    imagenesInput.value = "";
});

imagenesInput.addEventListener("change", () => {
    const files      = imagenesInput.files;
    const maxFiles   = 6;
    const maxSize    = 2 * 1024 * 1024;      // 2 MB
    const allowed    = ["image/jpeg","image/png","image/jpg"];

    if (files.length > maxFiles) {
        mostrarModal(`Solo puedes subir un máximo de ${maxFiles} imágenes.`);
        imagenesInput.value = "";
        return;
    }

    for (const file of files) {
        if (!allowed.includes(file.type)) {
            mostrarModal(`"${file.name}" no es un formato permitido (.jpg, .png, .jpeg).`);
            imagenesInput.value = "";
            return;
        }
        if (file.size > maxSize) {
            mostrarModal(`"${file.name}" supera los 2 MB.`);
            imagenesInput.value = "";
            return;
        }
    }
});

// ========================
// 3) CARGA DE LISTAS (categorías y estados)
// ========================
document.addEventListener("DOMContentLoaded", async () => {

    const categoriaSelect = document.getElementById("categoriaId");
    const estadoSelect    = document.getElementById("estado");          //  name="estadoArticuloId"

    // --- Categorías ---
    try {
        const res = await fetch("/categorias");
        if (!res.ok) throw new Error();
        const categorias = await res.json();

        categorias.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.nombre;
            categoriaSelect.appendChild(opt);
        });
    } catch {
        console.error("Error cargando categorías");
        mostrarModal("No se pudieron cargar las categorías");
    }

    // --- Estados del artículo ---
    try {
        const res = await fetch("/estado-articulo");
        if (!res.ok) throw new Error();
        const estados = await res.json();

        estados.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;            // <-- enviamos el ID al backend
            opt.textContent = e.nombre;  // texto visible
            estadoSelect.appendChild(opt);
        });
    } catch {
        console.error("Error cargando estados");
        mostrarModal("No se pudieron cargar los estados");
    }
});

// ========================
// 4) ENVÍO DEL FORMULARIO
// ========================
document.getElementById("solicitar-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validaciones básicas
    if (imagenesInput.files.length === 0) {
        await mostrarModal("Selecciona al menos una imagen");
        return;
    }
    if (imagenesInput.files.length > 6) {
        await mostrarModal("Máximo 6 imágenes permitidas");
        return;
    }
    const estadoValor = document.getElementById("estado").value;
    if (!estadoValor) {
        await mostrarModal("Selecciona el estado del producto");
        return;
    }

    try {
        const formData = new FormData(this);

        // DEBUG opcional
        // console.log("EstadoArticuloId:", formData.get("estadoArticuloId"));

        const resp = await fetch("/crearAnuncios", {
            method: "POST",
            body  : formData
        });

        if (resp.ok) {
            await mostrarModal("Anuncio enviado correctamente.");
            window.location.href = "/anuncios.html";
        } else {
            const err = resp.text();
            await mostrarModal("Error al enviar el anuncio: " + err);
        }
    } catch (err) {
        console.error("Error:", err);
        await mostrarModal("Ocurrió un error al enviar el formulario.");
    }
});
