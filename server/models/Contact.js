const db = require('../config/database');

class Contact {
    static async findAll() {
        const sql = `
            SELECT c.*, comp.company_name
            FROM contacts c
            INNER JOIN companies comp ON c.company_id = comp.id
            ORDER BY c.full_name
        `;
        return await db.allAsync(sql);
    }

    static async findById(id) {
        const sql = 'SELECT * FROM contacts WHERE id = ?';
        return await db.getAsync(sql, [id]);
    }

    static async findByCompany(companyId) {
        const sql = 'SELECT * FROM contacts WHERE company_id = ? ORDER BY full_name';
        return await db.allAsync(sql, [companyId]);
    }

    static async create(data) {
        const sql = `
            INSERT INTO contacts
            (company_id, full_name, department, position, email, phone, mobile, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.runAsync(sql, [
            data.company_id,
            data.full_name,
            data.department || null,
            data.position || null,
            data.email || null,
            data.phone || null,
            data.mobile || null,
            data.notes || null
        ]);
        return result.lastID;
    }

    static async update(id, data) {
        const sql = `
            UPDATE contacts
            SET company_id = ?, full_name = ?, department = ?,
                position = ?, email = ?, phone = ?, mobile = ?,
                notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        return await db.runAsync(sql, [
            data.company_id,
            data.full_name,
            data.department || null,
            data.position || null,
            data.email || null,
            data.phone || null,
            data.mobile || null,
            data.notes || null,
            id
        ]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM contacts WHERE id = ?';
        return await db.runAsync(sql, [id]);
    }
}

module.exports = Contact;
