import { Router } from 'express';
import { obtenerReservas, obtenerReservaPorCodigo, crearReserva, actualizarReservaPorCodigo, eliminarReservaPorCodigo } from '../controllers/reservas.controller.js';
const router = Router();

//consulta todas las reservas
router.get('/bookings', obtenerReservas);

//Consulta la reserva correspondiente al código
router.get('/bookings/:codigo', obtenerReservaPorCodigo);

//Crea una nueva reserva
router.post('/bookings', crearReserva);

//Actualiza la reserva correspondiente al código
router.patch('/bookings/:codigo', actualizarReservaPorCodigo);

//Elimina la reserva correspondiente al código
router.delete('/bookings/:codigo', eliminarReservaPorCodigo);

export default router