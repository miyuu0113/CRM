const db = require('../config/database');

class Company {
    static async findAll() {
        const sql = `
            SELECT c.*,
                   GROUP_CONCAT(DISTINCT u.full_name) as assigned_users
            FROM companies c
            LEFT JOIN company_users cu ON c.id = cu.company_id
            LEFT JOIN users u ON cu.user_id = u.id
            GROUP BY c.id
            ORDER BY c.company_name
        `;
        return await db.allAsync(sql);
    }

    static async findById(id) {
        const sql = 'SELECT * FROM companies WHERE id = ?';
        return await db.getAsync(sql, [id]);
    }

    static async create(data, createdBy) {
        const sql = `
            INSERT INTO companies
            (company_name, industry, postal_code, address, phone, fax, website, notes, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.runAsync(sql, [
            data.company_name,
            data.industry || null,
            data.postal_code || null,
            data.address || null,
            data.phone || null,
            data.fax || null,
            data.website || null,
            data.notes || null,
            createdBy
        ]);
        return result.lastID;
    }

    static async update(id, data) {
        const sql = `
            UPDATE companies
            SET company_name = ?, industry = ?, postal_code = ?,
                address = ?, phone = ?, fax = ?, website = ?,
                notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        return await db.runAsync(sql, [
            data.company_name,
            data.industry || null,
            data.postal_code || null,
            data.address || null,
            data.phone || null,
            data.fax || null,
            data.website || null,
            data.notes || null,
            id
        ]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM companies WHERE id = ?';
        return await db.runAsync(sql, [id]);
    }

    static async isUserAssigned(companyId, userId) {
        const sql = 'SELECT COUNT(*) as count FROM company_users WHERE company_id = ? AND user_id = ?';
        const result = await db.getAsync(sql, [companyId, userId]);
        return result.count > 0;
    }

    static async getAssignedUsers(companyId) {
        const sql = `
            SELECT u.id, u.username, u.full_name, u.email
            FROM users u
            INNER JOIN company_users cu ON u.id = cu.user_id
            WHERE cu.company_id = ?
        `;
        return await db.allAsync(sql, [companyId]);
    }

    static async assignUser(companyId, userId) {
        const sql = 'INSERT OR IGNORE INTO company_users (company_id, user_id) VALUES (?, ?)';
        return await db.runAsync(sql, [companyId, userId]);
    }

    static async unassignUser(companyId, userId) {
        const sql = 'DELETE FROM company_users WHERE company_id = ? AND user_id = ?';
        return await db.runAsync(sql, [companyId, userId]);
    }
}

module.exports = Company;
