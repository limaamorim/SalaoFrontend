document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        // Salva o usuário logado
        localStorage.setItem('usuario', JSON.stringify(result));
        
        alert('Login bem-sucedido!');
        window.location.href = 'site.html';
      } else {
        alert('Erro: ' + (result.message || 'Não foi possível fazer login'));
      }
    } catch (error) {
      alert('Erro na conexão com o servidor');
    }
  });
});
