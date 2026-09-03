function logout() {
  clearSession();
  window.location.href = '/login.html';
}

function protectPage() {
  if (!getUser() && !location.pathname.endsWith('login.html') && !location.pathname.endsWith('cadastro.html')) {
    window.location.href = '/login.html';
  }
}

document.addEventListener('DOMContentLoaded', protectPage);
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#logout-button')?.addEventListener('click', logout);
  document.querySelector('#chamado-form')?.addEventListener('submit', criarChamado);
  if (document.querySelector('#listaChamados')) loadDashboard();
});
