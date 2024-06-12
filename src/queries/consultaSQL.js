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
// agregar reserva
const addReservaQuery = async (fecha_reserva, fecha_salida, habitacion_id, cliente_id) => {
    try {
        await pool.query({
            text: `
                INSERT INTO reservas (fecha_reserva, fecha_salida, habitacion_id, cliente_id)
                VALUES ($1, $2, $3, $4)`,
            values: [fecha_reserva, fecha_salida, habitacion_id, cliente_id]
        });

        // Actualizar la disponibilidad de la habitación a no disponible
        await updateDisponibilidadHabitacionQuery(habitacion_id, false);
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
        const result = await pool.query(consultaGetReservas); // const result puede reemplazar const nombre consulta ubicando arriba
        console.log("getReservasQuery - Resultado:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        throw error;
    }
};
// Consulta para obtener detalles de una reserva específica
const getReservaByIdQuery = async (id) => {
    try {
        const result = await pool.query({
            text: `SELECT * FROM reservas WHERE id = $1`,
            values: [id]
        });
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};
// actualizar reserva
const updateReservaQuery = async (id, fecha_reserva, fecha_salida, habitacion_id, cliente_id) => {
    try {
        // Obtener la habitación anterior
        const oldResult = await pool.query({
            text: `SELECT habitacion_id FROM reservas WHERE id = $1`,
            values: [id]
        });
        const old_habitacion_id = oldResult.rows[0].habitacion_id;

        // Actualizar la reserva
        await pool.query({
            text: `
                UPDATE reservas
                SET fecha_reserva = $1, fecha_salida = $2, habitacion_id = $3, cliente_id = $4
                WHERE id = $5`,
            values: [fecha_reserva, fecha_salida, habitacion_id, cliente_id, id]
        });

        // Actualizar disponibilidad si la habitación ha cambiado
        if (old_habitacion_id !== habitacion_id) {
            await updateHabitacionDisponibilidadQuery(old_habitacion_id, true);
            await updateHabitacionDisponibilidadQuery(habitacion_id, false);
        }
    } catch (error) {
        throw error;
    }
};
// eliminar una reserva y actualizar la disponibilidad de la habitación
const deleteReservaQuery = async (id) => {
    try {
        // Obtener el ID de la habitación asociada a la reserva que se va a eliminar
        const result = await pool.query({
            text: `SELECT habitacion_id FROM reservas WHERE id = $1`,
            values: [id]
        });
        const habitacion_id = result.rows[0].habitacion_id;

        // Eliminar la reserva
        await pool.query({
            text: `DELETE FROM reservas WHERE id = $1`,
            values: [id]
        });

        // Actualizar la disponibilidad de la habitación a disponible
        await updateDisponibilidadHabitacionQuery(habitacion_id, true);
    } catch (error) {
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

// actualizar la disponibilidad de la habitación
const updateHabitacionDisponibilidadQuery = async (habitacionId, disponibilidad) => {
    try {
        await pool.query({
            text: `
                UPDATE habitaciones
                SET disponibilidad = $1
                WHERE id = $2`,
            values: [disponibilidad, habitacionId]
        });
    } catch (error) {
        throw error;
    }
};








console.log('consultasSQL.js - Configuración de consultas SQL completa');

export { 
    addUsuarioQuery, 
    getUsuariosQuery,
    getUsuarioByEmailQuery,
    updateUsuarioByEmailQuery,
    deletePerfilAndReservasByEmailQuery,

     
    addReservaQuery,    
    getReservasQuery,
    getReservaByIdQuery,            
    updateReservaQuery, 
    deleteReservaQuery,

    
    getHabitacionesQuery,
    updateHabitacionDisponibilidadQuery
};
