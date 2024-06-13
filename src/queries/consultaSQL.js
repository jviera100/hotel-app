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
// agregar reserva y cambia a no disponible la habitación
const addReservaQuery = async (fecha_reserva, fecha_salida, numero_habitacion, nombre_usuario) => {
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
        console.error('Error en addReservaQuery:', error);
        throw error;
    } finally {
        client.release();
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
// obtener todas las reservas asociadas al correo electrónico del cliente, mostrando usuario y numero de habitacion
const getReservasByEmailQuery = async (email) => {
    try {
        console.log("getReservasByEmailQuery - Inicio con email:", email);
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
        console.log("getReservasByEmailQuery - Ejecutando consulta:", consultaGetReservasByEmail);
        const result = await pool.query(consultaGetReservasByEmail);
        console.log("getReservasByEmailQuery - Resultado:", result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener reservas por correo electrónico:', error);
        throw error;
    }
};

// actualizar reserva
const updateReservaQuery = async (id, fecha_reserva, fecha_salida, habitacion_id, cliente_id) => {
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
// eliminar una reserva y cambia a disponible la habitación
const deleteReservaQuery = async (reservaId) => {
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
        console.error('Error en deleteReservaQuery:', error);
        throw error;
    } finally {
        client.release();
    }
};





// obtener todas las habitaciones con disponibilidad según reservas activas o fechas vigentes
const getHabitacionesQuery = async () => {
    try {
        console.log("getHabitacionesQuery - Inicio");
        const consultaGetHabitaciones = {
            text: `
                SELECT 
                    h.id, 
                    h.numero, 
                    h.descripcion, 
                    h.precio, 
                    h.disponibilidad, 
                    h.tipo_habitacion_id,
                    CASE 
                        WHEN r.habitacion_id IS NOT NULL THEN false 
                        ELSE true 
                    END AS esta_disponible
                FROM habitaciones h
                LEFT JOIN (
                    SELECT DISTINCT habitacion_id
                    FROM reservas
                    WHERE fecha_salida > NOW()
                ) r ON h.id = r.habitacion_id
            `,
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
    getUsuarioByEmailQuery,
    updateUsuarioByEmailQuery,
    deletePerfilAndReservasByEmailQuery,

     
    addReservaQuery,    
    getReservasQuery,
    getReservasByEmailQuery,            
    updateReservaQuery, 
    deleteReservaQuery,

    
    getHabitacionesQuery    
};
