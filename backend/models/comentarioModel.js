const { pool } = require('../config/database');

async function create({ chamado_id, usuario_id, mensagem }) {
  const [result] = await pool.execute(
    'INSERT INTO comentarios_chamado (chamado_id, usuario_id, mensagem) VALUES (?, ?, ?)',
    [chamado_id, usuario_id, mensagem]
  );
  return result.insertId;
}

async function findByChamadoId(chamadoId) {
  const [rows] = await pool.execute(
    `SELECT c.id, c.chamado_id, c.usuario_id, c.mensagem, c.created_at, u.nome AS usuario_nome, u.tipo AS usuario_tipo
     FROM comentarios_chamado c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.chamado_id = ?
     ORDER BY c.created_at ASC`,
    [chamadoId]
  );
  return rows;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM comentarios_chamado WHERE id = ?', [id]);
  return result.affectedRows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM comentarios_chamado WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = { create, findByChamadoId, remove, findById };
