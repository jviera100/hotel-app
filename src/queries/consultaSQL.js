// consultaSQL.js (CRUD)
import pool from "../models/config/db.js";

console.log('consultasSQL.js - Iniciando configuración de consultas SQL');

//USERS

// add user
const addUserQuery = async (usuario) => {
    try {
        console.log("addUserQuery - Inicio");
        const values = Object.values(usuario);
        const consultaUsuario = {
            text: `INSERT INTO usuarios (email, username, password, tipo_usuario, foto) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            values: values,
        };

        console.log("addUserQuery - Ejecutando consulta:", consultaUsuario);
        const result = await pool.query(consultaUsuario);
        console.log("addUserQuery - Resultado:", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        throw error;
    }
};
// user registration form view
const getUsersQuery = async () => {
    try {
        console.log("getUsersQuery - Inicio");
        const consultaGetUsuarios = {
            text: `
            SELECT * 
            FROM usuarios
            ORDER BY 
                CASE 
                    WHEN tipo_usuario = 'administrator' THEN 1
                    ELSE 2
                END,
                id;  -- Ordenar primero los administradores, luego los clientes por id
            `,
        };
        console.log("getUsersQuery - Ejecutando consulta:", consultaGetUsuarios);
        const result = await pool.query(consultaGetUsuarios);
        console.log("getUsersQuery - Resultado:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};
// get a user by email
const getUserByEmailQuery = async (email) => {
    try {
        console.log("getUserByEmailQuery - Inicio con email:", email);
        const getUsuarioByEmail = {
            text: 'SELECT * FROM usuarios WHERE email = $1',
            values: [email],
        };
        console.log("getUserByEmailQuery - Ejecutando consulta:", getUsuarioByEmail);
        const result = await pool.query(getUsuarioByEmail);
        console.log("getUserByEmailQuery - Resultado:", result.rows);
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener usuario por correo electrónico:', error);
        throw error;
    }
};
// update user
const updateUserByEmailQuery = async (email, updatedFields) => {
    try {
        console.log("updateUserByEmailQuery - Inicio con email:", email);
        const entries = Object.entries(updatedFields);
        const sets = entries.map(([key, value], index) => `${key} = $${index + 2}`).join(', ');
        const values = [email, ...Object.values(updatedFields)];

        const updateUsuarioByEmail = {
            text: `UPDATE usuarios SET ${sets} WHERE email = $1`,
            values: values
        };
        console.log("updateUserByEmailQuery - Ejecutando consulta:", updateUsuarioByEmail);
        await pool.query(updateUsuarioByEmail);
        console.log("updateUserByEmailQuery - Consulta ejecutada con éxito");
    } catch (error) {
        console.error('Error al actualizar el usuario por correo electrónico:', error);
        throw new Error('Error al actualizar el usuario por correo electrónico: ' + error.message);
    }
};
// delete a user's profile and reservations by email
const deleteUserAndReservationByEmailQuery = async (email) => {
    try {
        console.log("deleteUserAndReservationByEmailQuery - Inicio con email:", email);

        // Elimina las reservas del usuario
        const deleteReservasQuery = {
            text: 'DELETE FROM reservas WHERE cliente_id = (SELECT id FROM usuarios WHERE email = $1)',
            values: [email]
        };
        console.log("deleteUserAndReservationByEmailQuery - Ejecutando consulta para eliminar reservas:", deleteReservasQuery);
        await pool.query(deleteReservasQuery);

        // Elimina el perfil del usuario
        const deletePerfilQuery = {
            text: 'DELETE FROM usuarios WHERE email = $1',
            values: [email]
        };
        console.log("deleteUserAndReservationByEmailQuery - Ejecutando consulta para eliminar perfil:", deletePerfilQuery);
        await pool.query(deletePerfilQuery);

        console.log("deleteUserAndReservationByEmailQuery - Reservas y perfil eliminados correctamente");
    } catch (error) {
        console.error('Error al eliminar las reservas y el perfil por correo electrónico:', error);
        throw new Error('Error al eliminar las reservas y el perfil por correo electrónico: ' + error.message);
    }
};


// CONTACT

const addContactQuery = async (contacto) => {
    try {
        const { nombre, email, mensaje } = contacto;
        const consultaContacto = {
            text: 'INSERT INTO contactos (nombre, email, mensaje) VALUES ($1, $2, $3) RETURNING *',
            values: [nombre, email, mensaje],
        };
        const result = await pool.query(consultaContacto);
        return result.rows[0];
    } catch (error) {
        console.error('Error al agregar contacto:', error);
        throw error;
    }
};





//RESERVATION

// add reservation and change the room to unavailable
const addReservationQuery = async (fecha_reserva, fecha_salida, numero_habitacion, nombre_usuario) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Consulta para obtener los IDs necesarios
        const consultaIDs = {
            text: `
                SELECT h.id AS habitacion_id, u.id AS usuario_id
                FROM habitaciones h
                JOIN usuarios u ON u.username = $2
                WHERE h.numero = $1
            `,
            values: [numero_habitacion, nombre_usuario],
        };

        const resultIDs = await client.query(consultaIDs);

        if (resultIDs.rows.length === 0) {
            throw new Error('Habitación o usuario no encontrados');
        }

        const { habitacion_id, usuario_id } = resultIDs.rows[0];

        // Consulta para agregar la reserva
        const consultaReserva = {
            text: 'INSERT INTO reservas (fecha_reserva, fecha_salida, habitacion_id, cliente_id) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [fecha_reserva, fecha_salida, habitacion_id, usuario_id],
        };

        const resultReserva = await client.query(consultaReserva);

        // Actualizar la disponibilidad de la habitación
        const updateDisponibilidadQuery = {
            text: 'UPDATE habitaciones SET disponibilidad = $1 WHERE id = $2',
            values: [false, habitacion_id],
        };

        await client.query(updateDisponibilidadQuery);

        await client.query('COMMIT');
        return resultReserva.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en addReservationQuery:', error);
        throw error;
    } finally {
        client.release();
    }
};
// obtain all reservations, showing username and room number
const getReservationQuery = async () => {
    try {
        console.log("getReservationQuery - Inicio");
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
                usuarios u ON r.cliente_id = u.id
            ORDER BY 
                h.numero;  -- Ordenar por número de habitación
            `,
        };
        console.log("getReservationQuery - Ejecutando consulta:", consultaGetReservas);
        const result = await pool.query(consultaGetReservas);
        console.log("getReservationQuery - Resultado:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        throw error;
    }
};
// obtain all reservations associated with the client's email, showing username and room number
const getReservationByEmailQuery = async (email) => {
    try {
        console.log("getReservationByEmailQuery - Inicio con email:", email);
        const consultaGetReservasByEmail = {
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
                usuarios u ON r.cliente_id = u.id
            WHERE 
                u.email = $1;            
            `,
            values: [email],
        };
        console.log("getReservationByEmailQuery - Ejecutando consulta:", consultaGetReservasByEmail);
        const result = await pool.query(consultaGetReservasByEmail);
        console.log("getReservationByEmailQuery - Resultado:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener reservas por correo electrónico:', error);
        throw error;
    }
};
// update reservation
const updateReservationQuery = async (id, fecha_reserva, fecha_salida, habitacion_id, cliente_id) => {
    try {
        // Obtain the old habitacion_id before updating
        const oldResult = await pool.query({
            text: `SELECT habitacion_id FROM reservas WHERE id = $1`,
            values: [id]
        });
        const old_habitacion_id = oldResult.rows[0].habitacion_id;

        // Update the reservation
        await pool.query({
            text: `
                UPDATE reservas
                SET fecha_reserva = $1, fecha_salida = $2, habitacion_id = $3, cliente_id = $4
                WHERE id = $5`,
            values: [fecha_reserva, fecha_salida, habitacion_id, cliente_id, id]
        });

        // Update room availability based on changes
        if (old_habitacion_id !== habitacion_id) {
            await updateHabitacionDisponibilidadQuery(old_habitacion_id, true);
            await updateHabitacionDisponibilidadQuery(habitacion_id, false);
        }
    } catch (error) {
        throw error;
    }
};
// delete a reservation and make the room available
const deleteReservationQuery = async (reservaId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Obtener el ID de la habitación de la reserva
        const consultaHabitacionId = {
            text: 'SELECT habitacion_id FROM reservas WHERE id = $1',
            values: [reservaId],
        };

        const resultHabitacion = await client.query(consultaHabitacionId);

        if (resultHabitacion.rows.length === 0) {
            throw new Error('Reserva no encontrada');
        }

        const habitacion_id = resultHabitacion.rows[0].habitacion_id;

        // Eliminar la reserva
        const consultaEliminarReserva = {
            text: 'DELETE FROM reservas WHERE id = $1 RETURNING *',
            values: [reservaId],
        };

        const resultEliminar = await client.query(consultaEliminarReserva);

        // Actualizar la disponibilidad de la habitación
        const updateDisponibilidadQuery = {
            text: 'UPDATE habitaciones SET disponibilidad = $1 WHERE id = $2',
            values: [true, habitacion_id],
        };

        await client.query(updateDisponibilidadQuery);

        await client.query('COMMIT');
        return resultEliminar.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en deleteReservationQuery:', error);
        throw error;
    } finally {
        client.release();
    }
};



// ROOM

// add room
const addRoomQuery = async (numero, tipo_habitacion_id, descripcion, precio, disponibilidad) => {
    const query = `
        INSERT INTO habitaciones (numero, tipo_habitacion_id, descripcion, precio, disponibilidad)
        VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [numero, tipo_habitacion_id, descripcion, precio, disponibilidad];

    try {
        await pool.query(query, values);
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
};
// delete room
const deleteRoomQuery = async (id) => {
    const query = 'DELETE FROM habitaciones WHERE id = $1 RETURNING *';
    const values = [id];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};
// obtain all rooms with availability according to active reservations or current dates
const getRoomQuery = async () => {
    try {
        console.log("getRoomQuery - Inicio");
        const consultaGetHabitaciones = {
            text: `
                SELECT
                    h.id,
                    h.numero,
                    h.descripcion,
                    h.precio,
                    h.tipo_habitacion_id,
                    CASE
                        WHEN r.habitacion_id IS NOT NULL THEN 'No Disponible'
                        ELSE 'Disponible'
                    END AS disponibilidad,
                    u.username AS usuario_reservado
                FROM
                    habitaciones h
                LEFT JOIN reservas r ON h.id = r.habitacion_id AND r.fecha_salida > CURRENT_DATE
                LEFT JOIN usuarios u ON r.cliente_id = u.id
                ORDER BY
                    h.numero;
            `,
        };
        console.log("getRoomQuery - Ejecutando consulta:", consultaGetHabitaciones);
        const result = await pool.query(consultaGetHabitaciones);
        console.log("getRoomQuery - Resultado:", result.rows);
        console.log("Habitaciones con sus disponibilidades calculadas:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
        throw error;
    }
};


console.log('consultasSQL.js - Configuración de consultas SQL completa');

export { 
    addUserQuery, 
    getUsersQuery,
    getUserByEmailQuery,
    updateUserByEmailQuery,
    deleteUserAndReservationByEmailQuery,

    addContactQuery,
     
    addReservationQuery,    
    getReservationQuery,
    getReservationByEmailQuery,            
    updateReservationQuery, 
    deleteReservationQuery,

    addRoomQuery,
    deleteRoomQuery,    
    getRoomQuery,    
};
