const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/me', authMiddleware, (req, res) => res.json({ user: req.user }));
router.get('/', authMiddleware, roleMiddleware('tecnico'), (_req, res) => res.json({ message: 'Endpoint administrativo' }));

module.exports = router;
