const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async findByUsername(username) {
        return await db.getAsync('SELECT * FROM users WHERE username = ?', [username]);
    }

    static async findById(id) {
        return await db.getAsync('SELECT id, username, full_name, email, role, created_at FROM users WHERE id = ?', [id]);
    }

    static async findAll() {
        return await db.allAsync('SELECT id, username, full_name, email, role, created_at FROM users');
    }

    static async verifyPassword(plainPassword, hash) {
        return await bcrypt.compare(plainPassword, hash);
    }

    static async create(userData) {
        const passwordHash = await bcrypt.hash(userData.password, 10);
        const result = await db.runAsync(
            'INSERT INTO users (username, password_hash, full_name, email, role) VALUES (?, ?, ?, ?, ?)',
            [userData.username, passwordHash, userData.full_name, userData.email, userData.role || 'user']
        );
        return result.lastID;
    }

    static async update(id, userData) {
        const updates = [];
        const params = [];

        if (userData.username) {
            updates.push('username = ?');
            params.push(userData.username);
        }
        if (userData.full_name) {
            updates.push('full_name = ?');
            params.push(userData.full_name);
        }
        if (userData.email) {
            updates.push('email = ?');
            params.push(userData.email);
        }
        if (userData.role) {
            updates.push('role = ?');
            params.push(userData.role);
        }
        if (userData.password) {
            const passwordHash = await bcrypt.hash(userData.password, 10);
            updates.push('password_hash = ?');
            params.push(passwordHash);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        return await db.runAsync(sql, params);
    }

    static async delete(id) {
        return await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
    }
}

module.exports = User;
