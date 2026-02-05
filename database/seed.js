const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database/crm.db';

console.log('Seeding database...');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('✗ Error connecting to database:', err.message);
        process.exit(1);
    }
});

// 既存の管理者ユーザーをチェック
db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
    if (err) {
        console.error('✗ Error checking for admin user:', err.message);
        db.close();
        process.exit(1);
    }

    if (row) {
        console.log('✓ Admin user already exists');
        db.close();
        return;
    }

    // 管理者ユーザーのパスワードをハッシュ化
    const passwordHash = bcrypt.hashSync('admin123', 10);

    // 管理者ユーザーを作成
    db.run(
        'INSERT INTO users (username, password_hash, full_name, email, role) VALUES (?, ?, ?, ?, ?)',
        ['admin', passwordHash, 'システム管理者', 'admin@example.com', 'admin'],
        function(err) {
            if (err) {
                console.error('✗ Error creating admin user:', err.message);
                process.exit(1);
            }

            console.log('✓ Database seeded successfully');
            console.log('  Admin user created:');
            console.log('    Username: admin');
            console.log('    Password: admin123');

            db.close();
        }
    );
});
