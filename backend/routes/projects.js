// backend/routes/projects.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const connection = require('../db');
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

        const sql =
            'INSERT INTO projects (author, description, image_url) VALUES (?, ?, ?)';
        connection.query(
            sql,
            [author, description, result.secure_url],
            (err) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'Proyecto subido con éxito' });
            }
        );
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Ruta GET para ver todos los proyectos
router.get('/projects', (req, res) => {
    connection.query(
        'SELECT * FROM projects ORDER BY created_at DESC',
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results); // 👈 ESTO debe devolver un array
        }
    );
});

// Ruta DELETE para eliminar un proyecto por id
router.delete('/projects/:id', (req, res) => {
  const projectId = req.params.id;

  const sql = 'DELETE FROM projects WHERE id = ?';
  connection.query(sql, [projectId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json({ message: 'Proyecto eliminado correctamente' });
  });
});


module.exports = router;
