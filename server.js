const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// セッション設定
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24時間
        httpOnly: true,
        secure: false // HTTPS環境ではtrueに設定
    }
}));

// 静的ファイル提供
app.use(express.static('public'));

// APIルート
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/companies', require('./server/routes/companies'));
app.use('/api/contacts', require('./server/routes/contacts'));
app.use('/api/activities', require('./server/routes/activities'));
app.use('/api/users', require('./server/routes/users'));

// ルートパスへのアクセスをindex.htmlにリダイレクト
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`✓ CRM Server is running on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
});
