const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'gizliAnahtar', // Daha güvenli hale getir
  resave: false,
  saveUninitialized: true
}));

// Middleware
const authMiddleware = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/auth');
const panelRoutes = require('./routes/panel');

app.use('/', authRoutes);
app.use('/panel', authMiddleware, panelRoutes);

app.listen(PORT, () => {
  console.log(`Web panel http://localhost:${PORT} adresinde çalışıyor`);
});
