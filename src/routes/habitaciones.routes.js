import { Router } from 'express';
import { obtenerHabitaciones, obtenerHabitacionPorCodigo, crearHabitacion, actualizarHabitacionPorCodigo, eliminarHabitacionPorCodigo } from '../controllers/habitaciones.controller.js';
const router = Router();

//Consulta todas las habitaciones 
router.get('/rooms', obtenerHabitaciones);

//Consulta la habitacion correspondiente al código
router.get('/rooms/:codigo', obtenerHabitacionPorCodigo);

//Crea una nueva habitacion
router.post('/rooms', crearHabitacion);

//Actualiza la habitación correspondiente al código
router.patch('/rooms/:codigo', actualizarHabitacionPorCodigo);

//Elimina la habitación correspondiente al código
router.delete('/rooms/:codigo', eliminarHabitacionPorCodigo);

export default router