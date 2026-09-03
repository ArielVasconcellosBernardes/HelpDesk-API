async function loadDashboard() {
  const user = getUser();
  if (!user) return window.location.href = '/login.html';
  document.querySelector('#userName').textContent = user.nome;
  const response = await apiFetch('/api/chamados');
  const data = await response.json();
  const container = document.querySelector('#listaChamados');
  container.innerHTML = (data.chamados || []).map(chamado => `
    <tr>
      <td><a href="/chamado.html?id=${chamado.id}">${chamado.titulo}</a></td>
      <td><span class="badge ${statusClass(chamado.status)}">${chamado.status}</span></td>
      <td class="${priorityClass(chamado.prioridade)}">${chamado.prioridade}</td>
      <td>${new Date(chamado.created_at).toLocaleString()}</td>
      <td>${chamado.tecnico_nome || '-'}</td>
    </tr>
  `).join('');
}

function statusClass(status) {
  return `status-${String(status).toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
}

function priorityClass(priority) {
  return `priority-${String(priority).toLowerCase().replace(/\s+/g, '-')}`;
}

async function criarChamado(event) {
  event.preventDefault();
  const body = {
    titulo: document.querySelector('#titulo').value,
    descricao: document.querySelector('#descricao').value,
    prioridade: document.querySelector('#prioridade').value
  };
  const response = await apiFetch('/api/chamados', { method: 'POST', body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) return alert(data.error || 'Erro');
  window.location.reload();
}
