import express from 'express';
import indexRoutes from './routes/index.routes.js';
import habitacionesRoutes from './routes/habitaciones.routes.js';
import reservasRoutes from './routes/reservas.toutes.js';


const app = express();
app.use(express.json());
app.use('/api', indexRoutes);
app.use('/api', habitacionesRoutes);
app.use('/api', reservasRoutes);
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint no encontrado' })
});

export default app;