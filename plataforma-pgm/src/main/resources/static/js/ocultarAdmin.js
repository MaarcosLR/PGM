document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/usuario/info")
        .then(resp => resp.json())
        .then(usuario => {
            if (usuario.tipoCuenta === "admin") {
                const solicitarBtn = document.querySelector(".nav-link-solicitar");
                if (solicitarBtn) {
                    solicitarBtn.style.display = "none";
                }

                // Redirección si está en solicitar.html
                if (window.location.pathname.includes("solicitar.html")) {
                    window.location.href = "/anuncios.html";
                }
            }
        })
        .catch(err => {
            console.error("Error al verificar tipo de cuenta:", err);
        });
});
