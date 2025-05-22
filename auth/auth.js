const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/users.json')));

function login(req, res) {
    const { username, password } = req.body;
    if (username !== users.username) return res.status(401).json({ error: 'Kullanıcı adı hatalı.' });

    bcrypt.compare(password, users.passwordHash, (err, result) => {
        if (!result) return res.status(403).json({ error: 'Şifre hatalı.' });

        const token = jwt.sign({ username }, 'gizli_key', { expiresIn: '2h' });
        res.json({ token });
    });
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token eksik.' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'gizli_key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Geçersiz token.' });
        req.user = user;
        next();
    });
}

module.exports = { login, authMiddleware };
