const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database/crm.db';
const schemaPath = path.join(__dirname, 'schema.sql');

console.log('Initializing database...');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('✗ Error connecting to database:', err.message);
        process.exit(1);
    }
});

const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
    if (err) {
        console.error('✗ Error executing schema:', err.message);
        process.exit(1);
    }

    console.log('✓ Database initialized successfully');
    console.log(`  Database file: ${dbPath}`);

    db.close();
});
