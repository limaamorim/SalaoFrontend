document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form form');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('number').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.id || '';

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch('https://salaobackend-1.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email, number, password, gender })
      });

      const result = await response.text();
      if (response.ok) {
        alert(result);
        window.location.href = 'index.html';
      } else {
        alert('Erro: ' + result);
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
    }
  });

  // Máscara de telefone
  const phoneInput = document.getElementById('number');
  phoneInput.addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 11) input = input.slice(0, 11);

    let formatted = '';
    if (input.length > 0) formatted = '(' + input.slice(0, 2) + ') ';
    if (input.length > 2) formatted += input.slice(2, 7);
    if (input.length > 7) formatted += '-' + input.slice(7);

    e.target.value = formatted;
  });
});
