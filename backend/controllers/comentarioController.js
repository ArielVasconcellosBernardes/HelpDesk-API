const { body, param } = require('express-validator');
const comentarioModel = require('../models/comentarioModel');
const chamadoModel = require('../models/chamadoModel');

const createValidators = [
  body('mensagem').trim().isLength({ min: 2 }).withMessage('Mensagem invalida')
];

const deleteValidators = [param('id').isInt()];

/**
 * Cria um comentario em um chamado.
 *
 * @async
 */
async function create(req, res, next) {
  try {
    const chamado = await chamadoModel.findById(req.params.chamadoId);
    if (!chamado) return res.status(404).json({ error: 'Chamado nao encontrado' });
    if (req.user.tipo === 'cliente' && chamado.usuario_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado' });
    const id = await comentarioModel.create({
      chamado_id: req.params.chamadoId,
      usuario_id: req.user.id,
      mensagem: req.body.mensagem
    });
    res.status(201).json({ message: 'Comentario criado com sucesso', comentario_id: id });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const comentario = await comentarioModel.findById(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentario nao encontrado' });
    if (req.user.tipo === 'cliente' && comentario.usuario_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado' });
    await comentarioModel.remove(req.params.id);
    res.json({ message: 'Comentario removido com sucesso' });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, remove, createValidators, deleteValidators };
