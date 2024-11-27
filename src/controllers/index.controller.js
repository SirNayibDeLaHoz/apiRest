import { pool } from '../connection.js';

export const test = async (req, res) => {
    const [response] = await pool.query('SELECT "hola desde db" as result');
    res.json(response[0]);
};