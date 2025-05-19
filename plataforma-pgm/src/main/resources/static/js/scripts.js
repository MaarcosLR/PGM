// Navegación: marca el enlace activo
document.querySelectorAll('header nav a').forEach(link => {
    if (link.href === location.pathname.split('/').pop()) {
      link.classList.add('active');
    }
  });
  
  // En la página de "solicitar": validación simple antes de enviar
  const form = document.querySelector('#solicitar-form');
  if (form) {
    form.addEventListener('submit', e => {
      let ok = true;
      form.querySelectorAll('[required]').forEach(inp => {
        if (!inp.value.trim()) {
          inp.style.border = '2px solid red';
          ok = false;
        } else {
          inp.style.border = '';
        }
      });
      if (!ok) {
        e.preventDefault();
        alert('Por favor, rellena todos los campos obligatorios.');
      }
    });
  }
  