const router = require('express').Router();
const { register, login, registerValidators, loginValidators } = require('../controllers/authController');
const validationMiddleware = require('../middlewares/validationMiddleware');

router.post('/register', registerValidators, validationMiddleware, register);
router.post('/login', loginValidators, validationMiddleware, login);

module.exports = router;
