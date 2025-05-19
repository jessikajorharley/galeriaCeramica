const pool = require('./db');

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        author VARCHAR(100) NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla creada correctamente');
    process.exit();
  } catch (err) {
    console.error('❌ Error al crear la tabla:', err);
    process.exit(1);
  }
};

createTable();
