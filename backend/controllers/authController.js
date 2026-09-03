const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const usuarioModel = require('../models/usuarioModel');

const registerValidators = [
  body('nome').trim().isLength({ min: 3 }).withMessage('Nome invalido'),
  body('email').isEmail().withMessage('Email invalido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha muito curta'),
  body('tipo').isIn(['cliente', 'tecnico']).withMessage('Tipo invalido')
];

const loginValidators = [
  body('email').isEmail().withMessage('Email invalido'),
  body('senha').notEmpty().withMessage('Senha obrigatoria')
];

/**
 * Registra um novo usuario.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error} Quando ocorre erro durante o cadastro.
 */
async function register(req, res, next) {
  try {
    const { nome, email, senha, tipo } = req.body;
    const existing = await usuarioModel.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email ja cadastrado' });

    const hashed = await bcrypt.hash(senha, 10);
    const id = await usuarioModel.create({ nome, email, senha: hashed, tipo });
    const usuario = await usuarioModel.findById(id);
    return res.status(201).json({ message: 'Usuario cadastrado com sucesso', usuario });
  } catch (error) {
    next(error);
  }
}

/**
 * Realiza login de usuario.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 * @throws {Error} Quando ocorre erro durante o login.
 */
async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const usuario = await usuarioModel.findByEmail(email);
    if (!usuario) return res.status(401).json({ error: 'Credenciais invalidas' });
    const valid = await bcrypt.compare(senha, usuario.senha);
    if (!valid) return res.status(401).json({ error: 'Credenciais invalidas' });
    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, registerValidators, loginValidators };
