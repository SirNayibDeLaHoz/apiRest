import { pool } from "../connection.js";


export const obtenerHabitaciones = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM habitaciones');
        res.json({ data: rows });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

export const obtenerHabitacionPorCodigo = async (req, res) => {
    // Capturamos el parámetro 'codigo' de la URL
    const { codigo } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM habitaciones h WHERE h.codigo = ?', [codigo]);
        if (rows.length <= 0) return res.status(400).json({
            message: `No existe habitación con código ${codigo}`
        });
        res.json({ data: rows[0] });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

export const crearHabitacion = async (req, res) => {
    try {
        const { numero, tipo, valor } = req.body;
        if (!numero) {
            return res.status(400).json({ error: 'El campo numero es requerido' });
        } else if (!tipo) {
            return res.status(400).json({ error: 'El campo tipo es requerido' });
        } else if (!valor) {
            return res.status(400).json({ error: 'El campo valor es requerido' });
        }
        const [rows] = await pool.query('INSERT INTO habitaciones (numero, tipo, valor) VALUES (?,?,?)', [numero, tipo, valor]);
        res.json({ message: `Habitación con id ${rows.insertId} y tipo ${tipo} creada exitosamente.` });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

export const actualizarHabitacionPorCodigo = async (req, res) => {
    // Capturamos el parámetro 'codigo' de la URL
    const { codigo } = req.params;
    const { numero, tipo, valor } = req.body
    try {
        const [response] = await pool.query('UPDATE habitaciones SET numero = IFNULL(?,numero), tipo = IFNULL(?,tipo), valor = IFNULL(?,valor) WHERE codigo = ?', [numero, tipo, valor, codigo]);
        if (response.affectedRows <= 0) {
            return res.status(404).json({
                message: `No existe habitación con código ${codigo}`
            });
        }
        const [rows] = await pool.query('SELECT * FROM habitaciones h WHERE h.codigo = ?', [codigo]);
        res.json({ message: `Habitación con código ${codigo}, actualizada exitosamente`, data: rows[0] });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

export const eliminarHabitacionPorCodigo = async (req, res) => {
    // Capturamos el parámetro 'codigo' de la URL
    const { codigo } = req.params;
    try {
        const [response] = await pool.query('DELETE FROM habitaciones WHERE codigo = ?', [codigo]);
        if (response.affectedRows <= 0) {
            return res.status(404).json({
                error: `No existe habitación con código ${codigo}`
            });
        }
        res.json({ message: `Habitación con código ${codigo} eliminada exitosamente` });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                error: `No se puede eliminar la habitación con código ${codigo}, porque tiene reservas asociadas`
            });
        }
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};