const db = require('../config/database');

class ActivityLog {
    static async findAll(filters = {}) {
        let sql = `
            SELECT al.*,
                   c.company_name,
                   u.full_name as user_name,
                   con.full_name as contact_name
            FROM activity_logs al
            INNER JOIN companies c ON al.company_id = c.id
            INNER JOIN users u ON al.user_id = u.id
            LEFT JOIN contacts con ON al.contact_id = con.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.company_id) {
            sql += ' AND al.company_id = ?';
            params.push(filters.company_id);
        }

        if (filters.user_id) {
            sql += ' AND al.user_id = ?';
            params.push(filters.user_id);
        }

        sql += ' ORDER BY al.activity_date DESC';

        return await db.allAsync(sql, params);
    }

    static async findById(id) {
        const sql = `
            SELECT al.*,
                   c.company_name,
                   u.full_name as user_name,
                   con.full_name as contact_name
            FROM activity_logs al
            INNER JOIN companies c ON al.company_id = c.id
            INNER JOIN users u ON al.user_id = u.id
            LEFT JOIN contacts con ON al.contact_id = con.id
            WHERE al.id = ?
        `;
        return await db.getAsync(sql, [id]);
    }

    static async findByCompany(companyId) {
        const sql = `
            SELECT al.*,
                   u.full_name as user_name,
                   con.full_name as contact_name
            FROM activity_logs al
            INNER JOIN users u ON al.user_id = u.id
            LEFT JOIN contacts con ON al.contact_id = con.id
            WHERE al.company_id = ?
            ORDER BY al.activity_date DESC
        `;
        return await db.allAsync(sql, [companyId]);
    }

    static async create(data, userId) {
        const sql = `
            INSERT INTO activity_logs
            (company_id, contact_id, user_id, activity_type, subject, description,
             activity_date, next_action, next_action_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.runAsync(sql, [
            data.company_id,
            data.contact_id || null,
            userId,
            data.activity_type,
            data.subject,
            data.description || null,
            data.activity_date,
            data.next_action || null,
            data.next_action_date || null
        ]);
        return result.lastID;
    }

    static async update(id, data) {
        const sql = `
            UPDATE activity_logs
            SET activity_type = ?, subject = ?, description = ?,
                activity_date = ?, next_action = ?, next_action_date = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        return await db.runAsync(sql, [
            data.activity_type,
            data.subject,
            data.description || null,
            data.activity_date,
            data.next_action || null,
            data.next_action_date || null,
            id
        ]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM activity_logs WHERE id = ?';
        return await db.runAsync(sql, [id]);
    }

    static async getUpcomingActions() {
        const sql = `
            SELECT al.*,
                   c.company_name,
                   u.full_name as user_name
            FROM activity_logs al
            INNER JOIN companies c ON al.company_id = c.id
            INNER JOIN users u ON al.user_id = u.id
            WHERE al.next_action_date IS NOT NULL
            AND al.next_action_date >= date('now')
            ORDER BY al.next_action_date ASC
            LIMIT 10
        `;
        return await db.allAsync(sql);
    }
}

module.exports = ActivityLog;
