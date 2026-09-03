const { body, param } = require('express-validator');
const chamadoModel = require('../models/chamadoModel');
const comentarioModel = require('../models/comentarioModel');

const createValidators = [
  body('titulo').trim().isLength({ min: 3 }).withMessage('Titulo invalido'),
  body('descricao').trim().isLength({ min: 10 }).withMessage('Descricao invalida'),
  body('prioridade').isIn(['Baixa', 'Média', 'Alta', 'Urgente']).withMessage('Prioridade invalida')
];

const updateStatusValidators = [
  body('status').isIn(['Aberto', 'Em Atendimento', 'Concluído']).withMessage('Status invalido')
];

const idParamValidator = [param('id').isInt(), param('chamadoId').optional().isInt()];

/**
 * Cria um novo chamado.
 *
 * @async
 */
async function create(req, res, next) {
  try {
    const id = await chamadoModel.create({
      ...req.body,
      status: 'Aberto',
      usuario_id: req.user.id
    });
    const chamado = await chamadoModel.findById(id);
    res.status(201).json({ message: 'Chamado criado com sucesso', chamado });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const chamados = req.user.tipo === 'tecnico'
      ? await chamadoModel.findAllForTechnician()
      : await chamadoModel.findAllForClient(req.user.id);
    res.json({ chamados });
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const chamado = await chamadoModel.findById(req.params.id);
    if (!chamado) return res.status(404).json({ error: 'Chamado nao encontrado' });
    if (req.user.tipo === 'cliente' && chamado.usuario_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado' });
    res.json({ chamado });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const chamado = await chamadoModel.findById(req.params.id);
    if (!chamado) return res.status(404).json({ error: 'Chamado nao encontrado' });
    if (req.user.tipo === 'cliente' && chamado.usuario_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado' });
    await chamadoModel.updateByClient(req.params.id, req.body);
    const updated = await chamadoModel.findById(req.params.id);
    res.json({ message: 'Chamado atualizado com sucesso', chamado: updated });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const chamado = await chamadoModel.findById(req.params.id);
    if (!chamado) return res.status(404).json({ error: 'Chamado nao encontrado' });
    await chamadoModel.updateStatus(req.params.id, req.body.status);
    const updated = await chamadoModel.findById(req.params.id);
    res.json({ message: 'Status atualizado com sucesso', chamado: updated });
  } catch (error) {
    next(error);
  }
}

async function assignToTechnician(req, res, next) {
  try {
    const chamado = await chamadoModel.findById(req.params.id);
    if (!chamado) return res.status(404).json({ error: 'Chamado nao encontrado' });
    await chamadoModel.assignTechnician(req.params.id, req.user.id);
    const updated = await chamadoModel.findById(req.params.id);
    res.json({ message: 'Chamado assumido com sucesso', chamado: updated });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const chamado = await chamadoModel.findById(req.params.id);
    if (!chamado) return res.status(404).json({ error: 'Chamado nao encontrado' });
    if (req.user.tipo === 'cliente' && chamado.usuario_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado' });
    await chamadoModel.remove(req.params.id);
    res.json({ message: 'Chamado removido com sucesso' });
  } catch (error) {
    next(error);
  }
}

async function listComments(req, res, next) {
  try {
    const chamado = await chamadoModel.findById(req.params.chamadoId);
    if (!chamado) return res.status(404).json({ error: 'Chamado nao encontrado' });
    if (req.user.tipo === 'cliente' && chamado.usuario_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado' });
    const comentarios = await comentarioModel.findByChamadoId(req.params.chamadoId);
    res.json({ comentarios });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, list, detail, update, updateStatus, assignToTechnician, remove, listComments, createValidators, updateStatusValidators, idParamValidator };
