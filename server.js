const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./backend/routes/authRoutes');
const usuarioRoutes = require('./backend/routes/usuarioRoutes');
const chamadoRoutes = require('./backend/routes/chamadoRoutes');
const comentarioRoutes = require('./backend/routes/comentarioRoutes');
const errorMiddleware = require('./backend/middlewares/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./backend/docs/swagger');
const { pool } = require('./backend/config/database');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, 'frontend');
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: (origin, callback) => {
    const renderUrl = process.env.RENDER_EXTERNAL_URL || (process.env.RENDER_EXTERNAL_HOSTNAME
      ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
      : null);
    const allowed = [process.env.FRONTEND_URL, renderUrl, 'http://localhost:3000', 'http://127.0.0.1:3000']
      .filter(Boolean)
      .map((url) => url.replace(/\/$/, ''));
    if (!origin || allowed.includes(origin.replace(/\/$/, ''))) return callback(null, true);
    return callback(new Error('CORS nao permitido'));
  },
  credentials: true
}));

app.get('/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'HelpDesk API' });
  } catch (error) {
    next(error);
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/chamados', chamadoRoutes);
app.use('/api', comentarioRoutes);

app.use(express.static(frontendPath));

app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/api-docs' || req.path === '/health') return next();
  const fileMap = {
    '/login.html': 'login.html',
    '/cadastro.html': 'cadastro.html',
    '/dashboard.html': 'dashboard.html',
    '/chamado.html': 'chamado.html'
  };
  if (fileMap[req.path]) return res.sendFile(path.join(frontendPath, fileMap[req.path]));
  return res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`HelpDesk API rodando na porta ${PORT}`);
  if (!isProduction) console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
