// 認証ミドルウェア

function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

function requireAdmin(req, res, next) {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        return next();
    }
    res.status(403).json({ error: 'Forbidden: Admin access required' });
}

module.exports = {
    isAuthenticated,
    requireAdmin
};
