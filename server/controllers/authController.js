const User = require('../models/User');

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isValidPassword = await User.verifyPassword(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // セッションにユーザー情報を保存
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;

        res.json({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logged out successfully' });
    });
}

async function getCurrentUser(req, res) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    login,
    logout,
    getCurrentUser
};
