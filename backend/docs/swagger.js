const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HelpDesk API',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Autenticacao'],
          summary: 'Cadastra usuario',
          requestBody: { required: true },
          responses: { 201: { description: 'Criado' } }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Autenticacao'],
          summary: 'Login',
          requestBody: { required: true },
          responses: { 200: { description: 'OK' }, 401: { description: 'Credenciais invalidas' } }
        }
      },
      '/api/chamados': {
        get: { tags: ['Chamados'], security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Chamados'], security: [{ bearerAuth: [] }], responses: { 201: { description: 'Criado' } } }
      },
      '/api/chamados/{id}': {
        get: { tags: ['Chamados'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/chamados/{id}/status': {
        patch: { tags: ['Chamados'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/chamados/{id}/assumir': {
        patch: { tags: ['Chamados'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } }
      },
      '/api/chamados/{chamadoId}/comentarios': {
        get: { tags: ['Comentarios'], security: [{ bearerAuth: [] }], parameters: [{ name: 'chamadoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' } } },
        post: { tags: ['Comentarios'], security: [{ bearerAuth: [] }], parameters: [{ name: 'chamadoId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 201: { description: 'Criado' } } }
      },
      '/api/comentarios/{id}': {
        delete: { tags: ['Comentarios'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Removido' } } }
      },
      '/health': {
        get: { tags: ['Infra'], responses: { 200: { description: 'OK' } } }
      }
    }
  },
  apis: []
};

module.exports = swaggerJSDoc(options);
