// consultaSQL.js (CRUD)
import pool from "../models/config/db.js";
import { v4 as uuidv4 } from 'uuid';

console.log('consultasSQL.js - Initializing SQL query configuration');

//USERS 🪛🪪

// add user
const addUserQuery = async (usuario) => {
    try {
        console.log("addUserQuery - Start");
        const { email, username, password, tipo_usuario, foto } = usuario;
        const id = uuidv4();
        const consultaUsuario = {
            text: `INSERT INTO usuarios (id, email, username, password, tipo_usuario, foto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: [id, email, username, password, tipo_usuario, foto],
        };

        console.log("addUserQuery - Executing query:", consultaUsuario);
        const result = await pool.query(consultaUsuario);
        console.log("addUserQuery - Result:", result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};
// user registration form view
const getUsersQuery = async () => {
    try {
        console.log("getUsersQuery - Start");
        const consultaGetUsuarios = {
            text: `
            SELECT * 
            FROM usuarios
            ORDER BY 
                CASE 
                    WHEN tipo_usuario = 'administrator' THEN 1
                    ELSE 2
                END,
                username;  -- Order by username
            `,
        };
        console.log("getUsersQuery - Executing query:", consultaGetUsuarios);
        const result = await pool.query(consultaGetUsuarios);
        console.log("getUsersQuery - Result:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};
// get a user by email
const getUserByEmailQuery = async (email) => {
    try {
        console.log("getUserByEmailQuery - Start with email:", email);
        const getUsuarioByEmail = {
            text: 'SELECT * FROM usuarios WHERE email = $1',
            values: [email],
        };
        console.log("getUserByEmailQuery - Executing query:", getUsuarioByEmail);
        const result = await pool.query(getUsuarioByEmail);
        console.log("getUserByEmailQuery - Result:", result.rows);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
    }
};
// update user
const updateUserByEmailQuery = async (email, updatedFields) => {
    try {
        console.log("updateUserByEmailQuery - Start with email:", email);
        const entries = Object.entries(updatedFields);
        const sets = entries.map(([key, value], index) => `${key} = ${index + 2}`).join(', ');
        const values = [email, ...Object.values(updatedFields)];

        const updateUsuarioByEmail = {
            text: `UPDATE usuarios SET ${sets} WHERE email = $1`,
            values: values
        };
        console.log("updateUserByEmailQuery - Executing query:", updateUsuarioByEmail);
        await pool.query(updateUsuarioByEmail);
        console.log("updateUserByEmailQuery - Query executed successfully");
    } catch (error) {
        console.error('Error updating user by email:', error);
        throw new Error('Error updating user by email: ' + error.message);
    }
};
// delete a user's profile and reservations by email
const deleteUserAndReservationByEmailQuery = async (email) => {
    try {
        console.log("deleteUserAndReservationByEmailQuery - Start with email:", email);

        // Elimina las reservas del usuario
        const deleteReservasQuery = {
            text: 'DELETE FROM reservas WHERE cliente_id = (SELECT id FROM usuarios WHERE email = $1)',
            values: [email]
        };
        console.log("deleteUserAndReservationByEmailQuery - Executing query to delete reservations:", deleteReservasQuery);
        await pool.query(deleteReservasQuery);

        // Elimina el perfil del usuario
        const deletePerfilQuery = {
            text: 'DELETE FROM usuarios WHERE email = $1',
            values: [email]
        };
        console.log("deleteUserAndReservationByEmailQuery - Executing query to delete profile:", deletePerfilQuery);
        await pool.query(deletePerfilQuery);

        console.log("deleteUserAndReservationByEmailQuery - Reservations and profile deleted successfully");
    } catch (error) {
        console.error('Error deleting reservations and profile by email:', error);
        throw new Error('Error deleting reservations and profile by email: ' + error.message);
    }
};


// CONTACT 🪛📧

const addContactQuery = async (contacto) => {
    try {
        const { nombre, email, mensaje } = contacto;
        const id = uuidv4();
        const consultaContacto = {
            text: 'INSERT INTO contactos (id, nombre, email, mensaje) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [id, nombre, email, mensaje],
        };
        const result = await pool.query(consultaContacto);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding contact:', error);
        throw error;
    }
};


//RESERVATION 🪛🗓️

// add reservation and change the room to unavailable
const addReservationQuery = async (fecha_reserva, fecha_salida, numero_habitacion, nombre_usuario) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

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
            throw new Error('Room or user not found');
        }

        const { habitacion_id, usuario_id } = resultIDs.rows[0];
        const id = uuidv4();

        const consultaReserva = {
            text: 'INSERT INTO reservas (id, fecha_reserva, fecha_salida, habitacion_id, cliente_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [id, fecha_reserva, fecha_salida, habitacion_id, usuario_id],
        };

        const resultReserva = await client.query(consultaReserva);

        const updateDisponibilidadQuery = {
            text: 'UPDATE habitaciones SET disponibilidad = $1 WHERE id = $2',
            values: [false, habitacion_id],
        };

        await client.query(updateDisponibilidadQuery);

        await client.query('COMMIT');
        return resultReserva.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in addReservationQuery:', error);
        throw error;
    } finally {
        client.release();
    }
};
// obtain all reservations, showing username and room number
const getReservationQuery = async () => {
    try {
        console.log("getReservationQuery - Start");
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
                r.fecha_salida ASC, u.username ASC, h.numero ASC NULLS LAST;
            `,
        };
        console.log("getReservationQuery - Executing query:", consultaGetReservas);
        const result = await pool.query(consultaGetReservas);
        console.log("getReservationQuery - Result:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error getting reservations:', error);
        throw error;
    }
};
// obtain all reservations associated with the client's email, showing username and room number
const getReservationByEmailQuery = async (email) => {
    try {
        console.log("getReservationByEmailQuery - Start with email:", email);
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
                u.email = $1
            ORDER BY                 
                r.fecha_salida ASC, h.numero ASC NULLS LAST;                
            `,
            values: [email],
        };
        console.log("getReservationByEmailQuery - Executing query:", consultaGetReservasByEmail);
        const result = await pool.query(consultaGetReservasByEmail);
        console.log("getReservationByEmailQuery - Result:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error getting reservations by email:', error);
        throw error;
    }
};
// update reservation
const updateReservationQuery = async (id, fecha_reserva, fecha_salida, habitacion_id, cliente_id) => {
    try {
        const oldResult = await pool.query({
            text: `SELECT habitacion_id FROM reservas WHERE id = $1`,
            values: [id]
        });
        const old_habitacion_id = oldResult.rows[0].habitacion_id;

        await pool.query({
            text: `
                UPDATE reservas
                SET fecha_reserva = $1, fecha_salida = $2, habitacion_id = $3, cliente_id = $4
                WHERE id = $5`,
            values: [fecha_reserva, fecha_salida, habitacion_id, cliente_id, id]
        });

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

        const consultaHabitacionId = {
            text: 'SELECT habitacion_id FROM reservas WHERE id = $1',
            values: [reservaId],
        };

        const resultHabitacion = await client.query(consultaHabitacionId);

        if (resultHabitacion.rows.length === 0) {
            throw new Error('Reservation not found');
        }

        const habitacion_id = resultHabitacion.rows[0].habitacion_id;

        const consultaEliminarReserva = {
            text: 'DELETE FROM reservas WHERE id = $1 RETURNING *',
            values: [reservaId],
        };

        const resultEliminar = await client.query(consultaEliminarReserva);

        const updateDisponibilidadQuery = {
            text: 'UPDATE habitaciones SET disponibilidad = $1 WHERE id = $2',
            values: [true, habitacion_id],
        };

        await client.query(updateDisponibilidadQuery);

        await client.query('COMMIT');
        return resultEliminar.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in deleteReservationQuery:', error);
        throw error;
    } finally {
        client.release();
    }
};



// ROOM 🪛🏨🛌🏽🛎️

// add room
const addRoomQuery = async (numero, tipo_habitacion_id, descripcion, precio, disponibilidad) => {
    const query = `
        INSERT INTO habitaciones (id, numero, tipo_habitacion_id, descripcion, precio, disponibilidad)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const id = uuidv4();
    const values = [id, numero, tipo_habitacion_id, descripcion, precio, disponibilidad];

    try {
        await pool.query(query, values);
    } catch (error) {
        console.error('Error in SQL query:', error);
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
        console.log("getRoomQuery - Start");
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
                    h.disponibilidad DESC, h.numero ASC NULLS LAST;
            `,
        };
        console.log("getRoomQuery - Executing query:", consultaGetHabitaciones);
        const result = await pool.query(consultaGetHabitaciones);
        console.log("getRoomQuery - Result:", result.rows);
        console.log("Rooms with their calculated availabilities:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error getting rooms:', error);
        throw error;
    }
};


console.log('consultasSQL.js - SQL query configuration complete');

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
