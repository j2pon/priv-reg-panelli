const express = require('express');
const { login } = require('../auth/auth');
const router = express.Router();

router.post('/login', login);

module.exports = router;
