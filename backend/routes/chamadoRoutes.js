const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const controller = require('../controllers/chamadoController');

router.use(authMiddleware);

router.post('/', controller.createValidators, validationMiddleware, controller.create);
router.get('/', controller.list);
router.get('/:id', controller.idParamValidator, validationMiddleware, controller.detail);
router.patch('/:id', controller.idParamValidator, validationMiddleware, controller.update);
router.patch('/:id/status', controller.idParamValidator, controller.updateStatusValidators, validationMiddleware, roleMiddleware('tecnico'), controller.updateStatus);
router.patch('/:id/assumir', controller.idParamValidator, validationMiddleware, roleMiddleware('tecnico'), controller.assignToTechnician);
router.delete('/:id', controller.idParamValidator, validationMiddleware, controller.remove);
router.get('/:chamadoId/comentarios', controller.idParamValidator, validationMiddleware, controller.listComments);

module.exports = router;
