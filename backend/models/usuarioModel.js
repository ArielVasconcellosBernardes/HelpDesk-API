const { pool } = require('../config/database');

async function findByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT id, nome, email, tipo, created_at, updated_at FROM usuarios WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nome, email, senha, tipo }) {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, tipo]
  );
  return result.insertId;
}

module.exports = { findByEmail, findById, create };
