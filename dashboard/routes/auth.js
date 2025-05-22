const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Basit kullanıcı verisi
const users = [
  {
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10) // Parola hashlenmiş
  }
];

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    req.session.loggedIn = true;
    res.redirect('/panel');
  } else {
    res.render('login', { error: 'Kullanıcı adı veya şifre yanlış!' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
