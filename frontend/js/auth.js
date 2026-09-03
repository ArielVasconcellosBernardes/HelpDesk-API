async function login(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#senha').value;
    const response = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
    const data = await readResponse(response);
    if (!response.ok) return alert(getApiError(data, 'Erro no login'));
    saveSession(data);
    window.location.assign('/dashboard.html');
  } catch (error) {
    alert(error.message || 'Nao foi possivel conectar ao servidor. Verifique se a API esta rodando.');
  } finally {
    button.disabled = false;
  }
}

async function register(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const payload = {
      nome: document.querySelector('#nome').value,
      email: document.querySelector('#email').value,
      senha: document.querySelector('#senha').value,
      tipo: document.querySelector('#tipo').value
    };
    const response = await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    const data = await readResponse(response);
    if (!response.ok) return alert(getApiError(data, 'Erro no cadastro'));
    alert('Conta criada com sucesso. Agora faca login.');
    window.location.assign('/login.html');
  } catch (error) {
    alert(error.message || 'Nao foi possivel conectar ao servidor. Verifique se a API esta rodando.');
  } finally {
    button.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#login-form')?.addEventListener('submit', login);
  document.querySelector('#register-form')?.addEventListener('submit', register);
});

async function readResponse(response) {
  const text = await response.text();
  let data = {};
  try { data = JSON.parse(text); } catch { /* resposta nao JSON */ }
  if (response.status >= 500) {
    throw new Error(data.error || 'Erro no servidor. Confira o .env e a conexao com o MySQL.');
  }
  return data;
}

function getApiError(data, fallback) {
  if (data.error) return data.error;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors.map((error) => error.msg).join('\n');
  }
  return fallback;
}
