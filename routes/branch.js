const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');

// GET - Listar todas las sucursales
router.get('/', async (req, res) => {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las sucursales' });
    }
});

// POST - Crear nueva sucursal
router.post('/', async (req, res) => {
    const branch = new Branch({
        name: req.body.name,
        type: req.body.type
    });
    try {
        const newBranch = await branch.save();
        res.status(201).json(newBranch);
    } catch (err) {
        res.status(400).json({ message: 'Error al crear la sucursal' });
    }
});

// PUT - Editar sucursal
router.put('/:_id', async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) return res.status(404).json({ message: 'Sucursal no encontrada' });

        branch.name = req.body.name;
        branch.type = req.body.type;
        const updatedBranch = await branch.save();
        res.json(updatedBranch);
    } catch (err) {
        res.status(400).json({ message: 'Error al actualizar la sucursal' });
    }
});

// DELETE - Eliminar sucursal
router.delete('/:_id', async (req, res) => {
    try {
        console.log(`Attempting to delete branch with ID: ${req.params.id}`);
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            console.log('Branch not found');
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }

        await branch.remove();
        console.log('Branch deleted successfully');
        res.json({ message: 'Sucursal eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la sucursal:', err);
        res.status(500).json({ message: 'Error al eliminar la sucursal' });
    }
});

// Exportar el router correctamente
module.exports = router; 
