import { pool } from "../connection.js";
import { format } from 'date-fns';


export const obtenerReservas = async (req, res) => {
    try {
        const [reservas] = await pool.query('SELECT * FROM reservas');
        // Formatear las fechas antes de enviarlas al cliente
        const reservasFormateadas = reservas.map(reserva => ({
            ...reserva,
            fecha_reservacion: format(new Date(reserva.fecha_reservacion), 'yyyy-MM-dd'),
            fecha_entrada: format(new Date(reserva.fecha_entrada), 'yyyy-MM-dd'),
            fecha_salida: format(new Date(reserva.fecha_salida), 'yyyy-MM-dd'),
        }));
        res.json({ data: reservasFormateadas });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

export const obtenerReservaPorCodigo = async (req, res) => {
    // Capturamos el parámetro 'codigo' de la URL
    const { codigo } = req.params;
    try {
        const [reserva] = await pool.query('SELECT * FROM reservas h WHERE h.codigo = ?', [codigo]);
        if (reserva.length <= 0) {
            return res.status(400).json({
                message: `No existe reserva con código ${codigo}`
            });
        }
        // Formatear las fechas
        const reservaFormateada = {
            ...reserva[0],
            fecha_reservacion: format(new Date(reserva[0].fecha_reservacion), 'yyyy-MM-dd'),
            fecha_entrada: format(new Date(reserva[0].fecha_entrada), 'yyyy-MM-dd'),
            fecha_salida: format(new Date(reserva[0].fecha_salida), 'yyyy-MM-dd'),
        };
        res.json({ data: reservaFormateada });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

export const crearReserva = async (req, res) => {
    const { codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida } = req.body;
    try {
        if (!codigo_habitacion) {
            return res.status(400).json({ error: 'El campo codigo_habitacion es requerido' });
        } else if (!nombre_cliente) {
            return res.status(400).json({ error: 'El campo nombre_cliente es requerido' });
        } else if (!telefono_cliente) {
            return res.status(400).json({ error: 'El campo telefono_cliente es requerido' });
        } else if (!fecha_reservacion) {
            return res.status(400).json({ error: 'El campo fecha_reservacion es requerido' });
        } else if (!fecha_entrada) {
            return res.status(400).json({ error: 'El campo fecha_entrada es requerido' });
        } else if (!fecha_salida) {
            return res.status(400).json({ error: 'El campo fecha_salida es requerido' });
        }
        const [reserva] = await pool.query('INSERT INTO reservas (codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida) VALUES (?,?,?,?,?,?)', [codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida]);
        res.json({ message: `Reserva con id ${reserva.insertId} y nombre de cliente ${nombre_cliente} ha sido creada exitosamente.` });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

export const actualizarReservaPorCodigo = async (req, res) => {
    // Capturamos el parámetro 'codigo' de la URL
    const { codigo } = req.params;
    const { codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida } = req.body;
    try {
        const [response] = await pool.query('UPDATE reservas SET codigo_habitacion = IFNULL(?,codigo_habitacion), nombre_cliente = IFNULL(?,nombre_cliente), telefono_cliente = IFNULL(?,telefono_cliente) , fecha_reservacion = IFNULL(?,fecha_reservacion), fecha_entrada = IFNULL(?,fecha_entrada), fecha_salida = IFNULL(?,fecha_salida)  WHERE codigo = ?', [codigo_habitacion, nombre_cliente, telefono_cliente, fecha_reservacion, fecha_entrada, fecha_salida, codigo]);
        if (response.affectedRows <= 0) {
            return res.status(404).json({
                message: `No existe reserva con código ${codigo}`
            });
        }
        const [reserva] = await pool.query('SELECT * FROM reservas h WHERE h.codigo = ?', [codigo]);
        // Formatear las fechas
        const reservaFormateada = {
            ...reserva[0],
            fecha_reservacion: format(new Date(reserva[0].fecha_reservacion), 'yyyy-MM-dd'),
            fecha_entrada: format(new Date(reserva[0].fecha_entrada), 'yyyy-MM-dd'),
            fecha_salida: format(new Date(reserva[0].fecha_salida), 'yyyy-MM-dd'),
        };
        res.json({ message: `Reserva con código ${codigo} actualizada`, data: reservaFormateada });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

export const eliminarReservaPorCodigo = async (req, res) => {
    // Capturamos el parámetro 'codigo' de la URL
    const { codigo } = req.params;
    try {
        const [response] = await pool.query('DELETE FROM reservas WHERE codigo = ?', [codigo]);
        if (response.affectedRows <= 0) return res.status(404).json({
            message: `No existe reserva con código ${codigo}`
        })
        res.json({ message: `Reserva con código ${codigo} eliminada exitosamente` });
    } catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};