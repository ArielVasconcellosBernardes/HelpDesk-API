const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const controller = require('../controllers/comentarioController');

router.use(authMiddleware);

router.post('/chamados/:chamadoId/comentarios', controller.createValidators, validationMiddleware, controller.create);
router.delete('/comentarios/:id', controller.deleteValidators, validationMiddleware, controller.remove);

module.exports = router;
