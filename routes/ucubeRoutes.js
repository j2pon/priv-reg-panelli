const express = require('express');
const { getAll, add, remove } = require('../controllers/ucubeController');
const { authMiddleware } = require('../auth/auth');
const router = express.Router();

router.get('/', authMiddleware, getAll);
router.post('/', authMiddleware, add);
router.delete('/:userId', authMiddleware, remove);

module.exports = router;
