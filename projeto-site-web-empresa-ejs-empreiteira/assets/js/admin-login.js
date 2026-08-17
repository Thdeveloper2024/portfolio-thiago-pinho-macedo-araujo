const form = document.getElementById('loginForm');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value;
    const message = document.getElementById('loginMsg');

    if (user === 'barriga@123456' && pass === 'ejs@2026') {
      sessionStorage.setItem('ejsAdminAuth', '1');

      // Caminho absoluto: dominio.com/admin/index.html
      window.location.assign('/admin/index.html');
      return;
    }

    if (message) {
      message.textContent = 'Usuário ou senha inválidos.';
    }
  });
}