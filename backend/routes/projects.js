const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pool = require('../db');
const cloudinary = require('../utils/cloudinary');

// Multer configuración
const upload = multer({ dest: 'uploads/' });

// POST para subir proyecto con imagen
router.post('/projects', upload.single('image'), async (req, res) => {
    const { author, description } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    const imagePath = req.file.path;

    try {
        const result = await cloudinary.uploader.upload(imagePath);
        fs.unlinkSync(imagePath);

        const sql = `
          INSERT INTO projects (author, description, image_url)
          VALUES ($1, $2, $3)
          RETURNING *
        `;
        const { rows } = await pool.query(sql, [
            author,
            description,
            result.secure_url,
        ]);

        res.json({ message: 'Proyecto subido con éxito', project: rows[0] });
    } catch (error) {
        console.error('Error al subir proyecto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET para obtener todos los proyectos
router.get('/projects', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM projects ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// DELETE para eliminar proyecto por id
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
