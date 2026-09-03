const { pool } = require('../config/database');

async function create(data) {
  const [result] = await pool.execute(
    'INSERT INTO chamados (titulo, descricao, status, prioridade, usuario_id) VALUES (?, ?, ?, ?, ?)',
    [data.titulo, data.descricao, data.status, data.prioridade, data.usuario_id]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT c.*, u.nome AS cliente_nome, u.email AS cliente_email, u.tipo AS cliente_tipo,
            t.nome AS tecnico_nome, t.email AS tecnico_email
     FROM chamados c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     LEFT JOIN usuarios t ON t.id = c.tecnico_id
     WHERE c.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findAllForClient(userId) {
  const [rows] = await pool.execute(
    `SELECT c.*, u.nome AS cliente_nome, t.nome AS tecnico_nome
     FROM chamados c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     LEFT JOIN usuarios t ON t.id = c.tecnico_id
     WHERE c.usuario_id = ?
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return rows;
}

async function findAllForTechnician() {
  const [rows] = await pool.execute(
    `SELECT c.*, u.nome AS cliente_nome, t.nome AS tecnico_nome
     FROM chamados c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     LEFT JOIN usuarios t ON t.id = c.tecnico_id
     ORDER BY FIELD(c.status, 'Aberto', 'Em Atendimento', 'Concluído'), c.created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT c.*, u.nome AS cliente_nome, u.email AS cliente_email, u.tipo AS cliente_tipo,
            t.nome AS tecnico_nome, t.email AS tecnico_email
     FROM chamados c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     LEFT JOIN usuarios t ON t.id = c.tecnico_id
     WHERE c.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const [result] = await pool.execute('UPDATE chamados SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows;
}

async function assignTechnician(id, tecnicoId) {
  const [result] = await pool.execute(
    'UPDATE chamados SET tecnico_id = ?, status = ? WHERE id = ?',
    [tecnicoId, 'Em Atendimento', id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM chamados WHERE id = ?', [id]);
  return result.affectedRows;
}

async function updateByClient(id, { titulo, descricao, prioridade }) {
  const [result] = await pool.execute(
    'UPDATE chamados SET titulo = ?, descricao = ?, prioridade = ? WHERE id = ?',
    [titulo, descricao, prioridade, id]
  );
  return result.affectedRows;
}

module.exports = { create, findById, findAllForClient, findAllForTechnician, updateStatus, assignTechnician, remove, updateByClient };
