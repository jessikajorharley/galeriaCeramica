// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pool = require('../db'); // ✅ Usa pool en lugar de connection (PostgreSQL)
const cloudinary = require('../utils/cloudinary');

// Configuración de multer para manejar imágenes
const upload = multer({ dest: 'uploads/' });

// Ruta POST para subir proyecto
router.post('/projects', upload.single('image'), async (req, res) => {
    const { author, description } = req.body;
    const imagePath = req.file.path;

    try {
        const result = await cloudinary.uploader.upload(imagePath);
        fs.unlinkSync(imagePath); // Borrar imagen local después de subir

        const sql = `
      INSERT INTO projects (author, description, image_url)
      VALUES ($1, $2, $3)
    `;
        await pool.query(sql, [author, description, result.secure_url]);

        res.json({ message: 'Proyecto subido con éxito' });
    } catch (error) {
        console.error('Error al subir proyecto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta GET para ver todos los proyectos
router.get('/projects', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM projects ORDER BY created_at DESC'
        );
        res.json(result.rows); // ✅ PostgreSQL devuelve resultados en .rows
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta DELETE para eliminar un proyecto por id
router.delete('/projects/:id', async (req, res) => {
    const projectId = req.params.id;

    try {
        const result = await pool.query('DELETE FROM projects WHERE id = $1', [
            projectId,
        ]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        res.json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
