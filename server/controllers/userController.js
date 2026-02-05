const User = require('../models/User');

async function getAllUsers(req, res) {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createUser(req, res) {
    try {
        const { username, password, full_name, email, role } = req.body;

        if (!username || !password || !full_name || !email) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const userId = await User.create({
            username,
            password,
            full_name,
            email,
            role: role || 'user'
        });

        const user = await User.findById(userId);
        res.status(201).json(user);
    } catch (error) {
        console.error('Create user error:', error);
        if (error.message && error.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateUser(req, res) {
    try {
        const { username, full_name, email, role, password } = req.body;

        if (!username || !full_name || !email) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        await User.update(req.params.id, {
            username,
            full_name,
            email,
            role,
            ...(password && { password })
        });

        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        if (error.message && error.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteUser(req, res) {
    try {
        // 自分自身は削除できない
        if (parseInt(req.params.id) === req.session.userId) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await User.delete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
