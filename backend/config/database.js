const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

// Mantem a interface usada pelos modelos durante a migracao do MySQL.
pool.execute = async (sql, values = []) => {
  let index = 0;
  const postgresSql = sql.replace(/\?/g, () => `$${++index}`);
  const result = await pool.query(postgresSql, values);
  return [result.rows, { insertId: result.rows[0]?.id, affectedRows: result.rowCount }];
};

module.exports = { pool };
