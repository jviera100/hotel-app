// consultaSQL.js (CRUD)
import pool from "../models/config/db.js";

console.log('consultasSQL.js - Iniciando configuración de consultas SQL');
//PERFIL
// agregar un nuevo usuario a la base de datos para vista administrador y cliente
const addUsuarioQuery = async (usuario) => {
    try {
        console.log("addUsuarioQuery - Inicio");
        const values = Object.values(usuario);
        const consultaUsuario = {
            text: `INSERT INTO usuarios (email, username, password, tipo_usuario, foto) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            values: values,
        };

        console.log("addUsuarioQuery - Ejecutando consulta:", consultaUsuario);
        const result = await pool.query(consultaUsuario);
        console.log("addUsuarioQuery - Resultado:", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        throw error;
    }
};
// obtener todos los usuarios de la base de datos para vista administrador
const getUsuariosQuery = async () => {
    try {
        console.log("getUsuariosQuery - Inicio");
        const consultaGetUsuarios = {
            text: `SELECT * FROM usuarios`,
        };
        console.log("getUsuariosQuery - Ejecutando consulta:", consultaGetUsuarios);
        const result = await pool.query(consultaGetUsuarios);
        console.log("getUsuariosQuery - Resultado:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};
// obtener un usuario por su correo electrónico para vista cliente
const getUsuarioByEmailQuery = async (email) => {
    try {
        console.log("getUsuarioByEmailQuery - Inicio con email:", email);
        const getUsuarioByEmail = {
            text: 'SELECT * FROM usuarios WHERE email = $1',
            values: [email],
        };
        console.log("getUsuarioByEmailQuery - Ejecutando consulta:", getUsuarioByEmail);
        const result = await pool.query(getUsuarioByEmail);
        console.log("getUsuarioByEmailQuery - Resultado:", result.rows);
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener usuario por correo electrónico:', error);
        throw error;
    }
};
// actualizar un usuario por su correo electrónico para vista administrador y cliente
const updateUsuarioByEmailQuery = async (email, updatedFields) => {
    try {
        console.log("updateUsuarioByEmailQuery - Inicio con email:", email);
        const entries = Object.entries(updatedFields);
        const sets = entries.map(([key, value], index) => `${key} = $${index + 2}`).join(', ');
        const values = [email, ...Object.values(updatedFields)];

        const updateUsuarioByEmail = {
            text: `UPDATE usuarios SET ${sets} WHERE email = $1`,
            values: values
        };
        console.log("updateUsuarioByEmailQuery - Ejecutando consulta:", updateUsuarioByEmail);
        await pool.query(updateUsuarioByEmail);
        console.log("updateUsuarioByEmailQuery - Consulta ejecutada con éxito");
    } catch (error) {
        console.error('Error al actualizar el usuario por correo electrónico:', error);
        throw new Error('Error al actualizar el usuario por correo electrónico: ' + error.message);
    }
};
// eliminar el perfil y las reservas de un usuario por su correo electrónico para vista administrador y cliente
const deletePerfilAndReservasByEmailQuery = async (email) => {
    try {
        console.log("deletePerfilAndReservasByEmailQuery - Inicio con email:", email);

        // Elimina las reservas del usuario
        const deleteReservasQuery = {
            text: 'DELETE FROM reservas WHERE cliente_id = (SELECT id FROM usuarios WHERE email = $1)',
            values: [email]
        };
        console.log("deletePerfilAndReservasByEmailQuery - Ejecutando consulta para eliminar reservas:", deleteReservasQuery);
        await pool.query(deleteReservasQuery);

        // Elimina el perfil del usuario
        const deletePerfilQuery = {
            text: 'DELETE FROM usuarios WHERE email = $1',
            values: [email]
        };
        console.log("deletePerfilAndReservasByEmailQuery - Ejecutando consulta para eliminar perfil:", deletePerfilQuery);
        await pool.query(deletePerfilQuery);

        console.log("deletePerfilAndReservasByEmailQuery - Reservas y perfil eliminados correctamente");
    } catch (error) {
        console.error('Error al eliminar las reservas y el perfil por correo electrónico:', error);
        throw new Error('Error al eliminar las reservas y el perfil por correo electrónico: ' + error.message);
    }
};





//RESERVAS
// actualizar la disponibilidad de la habitación
const updateDisponibilidadHabitacionQuery = async (habitacionId, disponibilidad) => {
    try {
        await pool.query({
            text: `
                UPDATE habitaciones
                SET disponibilidad = $1
                WHERE id = $2`,
            values: [disponibilidad, habitacionId]
        });

        return true;
    } catch (error) {
        throw error;
    }
};
// obtener todas las reservas
const getReservasQuery = async () => {
    try {
        console.log("getReservasQuery - Inicio");
        const consultaGetReservas = {
            text: `
            SELECT 
                r.id,
                r.fecha_reserva,
                r.fecha_salida,
                h.numero AS habitacion_numero,
                u.username AS nombre_usuario
            FROM             
                reservas r
            JOIN             
                habitaciones h ON r.habitacion_id = h.id
            JOIN             
                usuarios u ON r.cliente_id = u.id;            
            `,
        };
        console.log("getReservasQuery - Ejecutando consulta:", consultaGetReservas);
        const result = await pool.query(consultaGetReservas);
        console.log("getReservasQuery - Resultado:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        throw error;
    }
};
// obtener todas las habitaciones
const getHabitacionesQuery = async () => {
    try {
        console.log("getHabitacionesQuery - Inicio");
        const consultaGetHabitaciones = {
            text: `SELECT * FROM habitaciones`,
        };
        console.log("getHabitacionesQuery - Ejecutando consulta:", consultaGetHabitaciones);
        const result = await pool.query(consultaGetHabitaciones);
        console.log("getHabitacionesQuery - Resultado:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
        throw error;
    }
};







console.log('consultasSQL.js - Configuración de consultas SQL completa');

export { 
    addUsuarioQuery, 
    getUsuariosQuery,
    updateDisponibilidadHabitacionQuery,     
    getReservasQuery,    
    getHabitacionesQuery, 
    getUsuarioByEmailQuery, 
    updateUsuarioByEmailQuery, 
    deletePerfilAndReservasByEmailQuery     
};
