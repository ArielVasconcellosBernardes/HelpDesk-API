# HelpDesk-API

Sistema HelpDesk com API REST e front-end em um unico projeto.

## Tecnologias

- Node.js
- Express
- MySQL
- bcryptjs
- jsonwebtoken
- express-validator
- swagger-jsdoc
- swagger-ui-express
- HTML, CSS e JavaScript puro

## Estrutura

- `backend/` API, controllers, models, routes, middlewares e Swagger
- `frontend/` telas consumindo a API via `fetch()`

## Instalação

```bash
npm install
```

## Configuração

1. Copie `.env.example` para `.env`
2. Preencha as variáveis de ambiente
3. Execute `database.sql` no MySQL

Abra as telas pela API, usando `http://localhost:3000/login.html` ou
`http://localhost:3000/cadastro.html`. Nao abra os HTML diretamente nem pelo Live
Server, pois as requisicoes devem usar a mesma origem da API.

## Execução

```bash
npm run dev
```

ou

```bash
npm start
```

## Rotas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/chamados`
- `POST /api/chamados`
- `GET /api/chamados/:id`
- `PATCH /api/chamados/:id`
- `PATCH /api/chamados/:id/status`
- `PATCH /api/chamados/:id/assumir`
- `DELETE /api/chamados/:id`
- `GET /api/chamados/:chamadoId/comentarios`
- `POST /api/chamados/:chamadoId/comentarios`
- `DELETE /api/comentarios/:id`
- `GET /health`
- `GET /api-docs`

## Deploy

Configure no Render:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `FRONTEND_URL`

O front-end é servido pelo próprio Express.
