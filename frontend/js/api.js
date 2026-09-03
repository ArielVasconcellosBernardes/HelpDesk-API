async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  return response;
}

function saveSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('usuario')); } catch { return null; }
}
