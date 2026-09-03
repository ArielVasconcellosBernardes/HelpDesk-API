async function loadChamado() {
  const user = getUser();
  if (!user) return window.location.href = '/login.html';
  const id = new URLSearchParams(window.location.search).get('id');
  const response = await apiFetch(`/api/chamados/${id}`);
  const data = await response.json();
  if (!response.ok) return alert(data.error || 'Erro ao carregar chamado');
  renderChamado(data.chamado);
  await loadComentarios(id);
  if (user.tipo === 'tecnico') renderAcoesTecnico(id, data.chamado);
  document.querySelector('#formComentario').onsubmit = (event) => enviarComentario(event, id);
}

function renderChamado(chamado) {
  document.querySelector('#detalhes').innerHTML = `
    <p><strong>Titulo:</strong> ${chamado.titulo}</p>
    <p><strong>Descricao:</strong> ${chamado.descricao}</p>
    <p><strong>Status:</strong> ${chamado.status}</p>
    <p><strong>Prioridade:</strong> ${chamado.prioridade}</p>
    <p><strong>Cliente:</strong> ${chamado.cliente_nome}</p>
    <p><strong>Tecnico:</strong> ${chamado.tecnico_nome || '-'}</p>
    <p><strong>Data:</strong> ${new Date(chamado.created_at).toLocaleString()}</p>
  `;
}

async function loadComentarios(id) {
  const response = await apiFetch(`/api/chamados/${id}/comentarios`);
  const data = await response.json();
  document.querySelector('#comentarios').innerHTML = (data.comentarios || []).map(c => `
    <div class="panel"><strong>${c.usuario_nome}</strong><p>${c.mensagem}</p></div>
  `).join('');
}

function renderAcoesTecnico(id, chamado) {
  const container = document.querySelector('#acoesTecnico');
  container.innerHTML = `
    <button id="assumir">Assumir chamado</button>
    <select id="novoStatus">
      <option${chamado.status === 'Aberto' ? ' selected' : ''}>Aberto</option>
      <option${chamado.status === 'Em Atendimento' ? ' selected' : ''}>Em Atendimento</option>
      <option${chamado.status === 'Concluído' ? ' selected' : ''}>Concluído</option>
    </select>
    <button id="alterar">Alterar status</button>
  `;
  document.querySelector('#assumir').onclick = async () => {
    await apiFetch(`/api/chamados/${id}/assumir`, { method: 'PATCH' });
    window.location.reload();
  };
  document.querySelector('#alterar').onclick = async () => {
    await apiFetch(`/api/chamados/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: document.querySelector('#novoStatus').value }) });
    window.location.reload();
  };
}

async function enviarComentario(event, id) {
  event.preventDefault();
  const mensagem = document.querySelector('#mensagem').value;
  const response = await apiFetch(`/api/chamados/${id}/comentarios`, { method: 'POST', body: JSON.stringify({ mensagem }) });
  const data = await response.json();
  if (!response.ok) return alert(data.error || 'Erro');
  document.querySelector('#mensagem').value = '';
  await loadComentarios(id);
}

document.addEventListener('DOMContentLoaded', loadChamado);
