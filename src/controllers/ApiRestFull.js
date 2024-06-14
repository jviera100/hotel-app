// ApiRestFull.js (Controllers  )
import path from 'path';
import { 
    addUserQuery, 
    getUsersQuery,
    getUserByEmailQuery,
    updateUserByEmailQuery,
    deleteUserAndReservationByEmailQuery,

     
    addReservationQuery,    
    getReservationQuery,
    getReservationByEmailQuery,            
    updateReservationQuery, 
    deleteReservationQuery,

    addRoomQuery,
    deleteRoomQuery,
    getRoomQuery        
 } from '../queries/consultaSQL.js';
import jwt from 'jsonwebtoken';

const __dirname = path.resolve();

console.log('ApiRestFull.js - Iniciando configuración de controllers');

// home view
const getHomeControl = async (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('homeControl - Inicio');
        
        // Renderiza la plantilla 'Home' con los siguientes parámetros
        res.render('Home', {
            currentPage: 'home', // Define la página actual como 'home'
            isAuthenticated: !!req.cookies.token, // Indica si el usuario está autenticado basado en la existencia de la cookie de token
            showhomeButton: true, // Muestra el botón de inicio en la interfaz de usuario
            showContactButton: true, // Muestra el botón de contacto en la interfaz de usuario
            showRegisterButton: true, // Muestra el botón de registro en la interfaz de usuario
            showLoginButton: true, // Muestra el botón de inicio de sesión en la interfaz de usuario
            showProfileButton: false, // Oculta el botón de perfil en la interfaz de usuario
            showRoomButton: false, // Oculta el botón de habitaciones en la interfaz de usuario
            showGreetingButton: false, // Oculta el mensaje de bienvenida en la interfaz de usuario
            showLogoutButton: false, // Oculta el botón de cierre de sesión en la interfaz de usuario
            currentUserName: req.user ? req.user.username : "" // Si el usuario está autenticado, pasa el nombre de usuario actual; de lo contrario, pasa una cadena vacía
        });
        
        // Registro de finalización del controlador en la consola
        console.log('homeControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el procesamiento de la solicitud
        console.error('Error en homeControl:', error); // Registro del error en la consola de errores
        res.status(500).send('Error al obtener los datos: ' + error.message); // Envía una respuesta de error HTTP con el mensaje de error detallado
    }
};





// login view 
const getLoginControl = async (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('getLoginControl - Inicio');
        
        // Renderiza la vista de inicio de sesión con los siguientes parámetros
        res.render('Login', {
            showhomeButton: true, // Mostrar botón de inicio en la barra de navegación
            showContactButton: true, // Mostrar botón de contacto en la barra de navegación
            showRegisterButton: true, // Mostrar botón de registro en la barra de navegación
            showLoginButton: false, // Ocultar botón de inicio de sesión en la barra de navegación
            showProfileButton: false, // Ocultar botón de perfil en la barra de navegación
            showRoomButton: false, // Ocultar botón de habitaciones en la barra de navegación
            showGreetingButton: false, // Ocultar mensaje de bienvenida en la barra de navegación
            showLogoutButton: false, // Ocultar botón de cierre de sesión en la barra de navegación
        });

        // Registro de finalización del controlador en la consola
        console.log('getLoginControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el proceso
        console.error('Error en getLoginControl:', error); // Registro del error en la consola de errores
        res.status(500).send('Ocurrió un error al cargar la vista de inicio de sesión'); // Envía una respuesta de error HTTP con un mensaje de error
    }
};
// process login => getUserByEmailQuery
const postLoginControl = async (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('postLoginControl - Inicio');
        
        // Extrae el correo electrónico y la contraseña del cuerpo de la solicitud
        const { email, password } = req.body;
        console.log('Intento de inicio de sesión para:', email);

        // Busca al usuario en la base de datos utilizando su correo electrónico
        const usuario = await getUserByEmailQuery(email);
        console.log('Usuario obtenido de la base de datos:', usuario);

        // Verifica si el usuario existe
        if (!usuario) {
            console.log('Usuario no encontrado');
            return res.status(401).send('Credenciales inválidas');
        }

        // Verifica si la contraseña es correcta
        if (usuario.password !== password) {
            console.log('Contraseña incorrecta');
            return res.status(401).send('Credenciales inválidas');
        }

        // Genera un token de autenticación
        const token = jwt.sign({ userId: usuario.id, email: usuario.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log('Token generado:', token);

        // Almacena el token en una cookie HTTP
        res.cookie('token', token, {
            httpOnly: true, // La cookie solo es accesible a través de HTTP
            secure: process.env.NODE_ENV === 'production', // Define si se debe usar HTTPS (solo en producción)
            sameSite: 'Strict' // La cookie solo se envía en solicitudes del mismo sitio
        });
        console.log('Token almacenado en cookie');
        console.log('Cookies enviadas:', res.getHeaders()['set-cookie']);

        // Redirige al usuario según su tipo de usuario
        if (usuario.tipo_usuario === 'administrator' || usuario.tipo_usuario === 'admin') {
            console.log(`Redirigiendo a /admin/inicio para el usuario ${usuario.email}`);
            res.redirect(`/admin/inicio/${email}`);
        } else {
            console.log(`Redirigiendo a /habitaciones/${email} para el usuario ${usuario.email}`);
            res.redirect(`/customer/inicio/${email}`);
        }

        // Registro de finalización del controlador en la consola
        console.log('postLoginControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el proceso
        console.error('Error al procesar el inicio de sesión:', error); // Registro del error en la consola de errores
        res.status(500).send('Ocurrió un error al iniciar sesión: ' + error.message); // Envía una respuesta de error HTTP con un mensaje de error
    }
};
// process logout
const logoutControl = (req, res) => {
    try {
        // Registro del inicio del controlador
        console.log('logoutControl - Inicio');

        // Eliminar la cookie del token
        res.clearCookie('token');
        // Registro de la eliminación de la cookie del token
        console.log('Cookie del token eliminada');

        // Redirigir al usuario a la página de inicio de sesión
        res.redirect('/login');
        // Registro de la redirección a /login
        console.log('Redirigiendo a /login');

        // Registro del fin del controlador
        console.log('logoutControl - Fin');
    } catch (error) {
        // Capturar cualquier error que ocurra durante el proceso
        console.error('Error en logoutControl:', error);
        // Enviar un mensaje de error al frontend junto con el código de estado 500
        res.status(500).send('Ocurrió un error al cerrar sesión');
    }
};





// contact view
const getContactControl = (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('getContactControl - Inicio');
        
        // Renderiza la plantilla 'Contacto' con los siguientes parámetros
        res.render('Contacto', {
            currentPage: 'contacto', // Define la página actual como 'contacto'
            isAuthenticated: !!req.cookies.token, // Indica si el usuario está autenticado basado en la existencia de la cookie de token
            showhomeButton: true, // Muestra el botón de inicio en la interfaz de usuario
            showContactButton: false, // Oculta el botón de contacto en la interfaz de usuario (ya estamos en la página de contacto)
            showRegisterButton: true, // Muestra el botón de registro en la interfaz de usuario
            showLoginButton: true, // Muestra el botón de inicio de sesión en la interfaz de usuario
            showProfileButton: false, // Oculta el botón de perfil en la interfaz de usuario
            showRoomButton: false, // Oculta el botón de habitaciones en la interfaz de usuario
            showGreetingButton: false, // Oculta el mensaje de bienvenida en la interfaz de usuario
            showLogoutButton: false, // Oculta el botón de cierre de sesión en la interfaz de usuario
        });
        
        // Registro de finalización del controlador en la consola
        console.log('getContactControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el procesamiento de la solicitud
        console.error('Error en getContactControl:', error); // Registro del error en la consola de errores
        res.status(500).send('Ocurrió un error al renderizar la página de contacto'); // Envía una respuesta de error HTTP con el mensaje de error detallado
    }
};
// process sending the contact form
const postSendContactControl = (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('enviarContactoControl - Inicio');

        // Extrae los datos del formulario de contacto desde el cuerpo de la solicitud
        const { nombre, email, telefono, mensaje } = req.body;
        // Registro de los datos del formulario de contacto en la consola
        console.log('Datos de contacto recibidos:', { nombre, email, telefono, mensaje });

        // Envía una respuesta exitosa con un mensaje al cliente
        res.status(200).send({ message: "Mensaje recibido. Nos pondremos en contacto contigo pronto." });

        // Registro de finalización del controlador en la consola
        console.log('enviarContactoControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el procesamiento de la solicitud
        console.error('Error en enviarContactoControl:', error); // Registro del error en la consola de errores
        res.status(500).send('Ocurrió un error al procesar el formulario de contacto'); // Envía una respuesta de error HTTP con el mensaje de error detallado
    }
};




// USERS

// add user => addUserQuery
const addUserRegistrationControl = async (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('addUsuarioControl - Inicio');

        // Extraer los datos del nuevo usuario desde el cuerpo de la solicitud
        const { email, username, password, tipo_usuario } = req.body;
        // Extraer el archivo de imagen de perfil del usuario desde los archivos de la solicitud
        const foto_perfil = req.files ? req.files.foto : null;
        // Registro de los datos del nuevo usuario y el archivo de imagen en la consola
        console.log('Archivos de la solicitud:', req.files);
        console.log('Datos del nuevo usuario:', { email, username, password, tipo_usuario, foto_perfil });

        // Verificar si se proporcionó un archivo de imagen de perfil
        if (!foto_perfil) {
            // Si no se proporciona, lanzar un error
            throw new Error('No se ha proporcionado un archivo de imagen');
        }

        // Generar un nombre único para el archivo de imagen
        const fotoName = `${Date.now()}_${foto_perfil.name}`;
        // Definir la ruta de la foto de perfil en el servidor
        const pathPhoto = `img/${fotoName}`;
        // Mover el archivo de imagen al directorio deseado en el servidor
        foto_perfil.mv(`${__dirname}/assets/${pathPhoto}`, async (err) => {
            // Manejo de errores: si ocurre un error al cargar la imagen
            if (err) {
                // Lanzar un error con el mensaje correspondiente
                throw new Error('Error al cargar la imagen');
            }
            // Crear un objeto de usuario con los datos proporcionados y la ruta de la foto de perfil
            const usuario = { email, username, password, tipo_usuario, foto: pathPhoto };
            // Agregar el usuario a la base de datos
            await addUserQuery(usuario);
            // Registro de la adición exitosa del usuario en la consola
            console.log('Usuario agregado:', usuario);
            // Redirigir al usuario a la página de inicio de sesión después de agregar exitosamente el usuario
            res.status(201).redirect('/login');
            // Registro de finalización del controlador en la consola
            console.log('addUsuarioControl - Fin');
        });
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el proceso
        console.error('Error en addUsuarioControl:', error); // Registro del error en la consola de errores
        res.status(500).send(error.message); // Envío de una respuesta de error HTTP con el mensaje de error detallado
    }
};
// user registration form view => getUserByEmailQuery
const getUserRegistrationControl = async (req, res) => {
    try {
        console.log('registroControl - Inicio');

        // Verificar si el usuario está autenticado
        const isAuthenticated = !!req.cookies.token;
        let usuario = null;

        if (isAuthenticated && req.user) {
            // Extraer el email del usuario autenticado desde el token decodificado
            const { email } = req.user;
            console.log('Email del usuario:', email);

            // Obtener el usuario de la base de datos utilizando el email
            usuario = await getUserByEmailQuery(email);
            console.log('Usuario obtenido de la base de datos:', usuario);

            if (!usuario) {
                console.log('Usuario no encontrado');
                return res.status(404).send('Usuario no encontrado');
            }
            // Registro del tipo de usuario obtenido
            console.log('Tipo de usuario obtenido:', usuario.tipo_usuario);

            const showAdminButton = true;
            console.log('Valor de showAdminButton:', showAdminButton);        }

        // Configuración del navbar dependiendo del estado de autenticación y tipo de usuario
        const navbarConfig = {
            showhomeButton: true, // Mostrar botón
            showContactButton: true, // Mostrar botón
            showRegisterButton: false, // Ocultar botón
            showLoginButton: !isAuthenticated, // Ocultar botón si esta está autenticado
            showProfileButton: false, // Ocultar botón
            showRoomButton: false, // Ocultar botón
            showGreetingButton: isAuthenticated, // Mostrar boton saludo si está autenticado
            showAdminButton: isAuthenticated, // Mostrar botón si está autenticado
            showLogoutButton: isAuthenticated, // Mostrar botón si está autenticado
        };            

        console.log('Configuración del navbar:', navbarConfig);

        res.render("Registro", {
            user: usuario,
            currentUserEmail: usuario ? usuario.email : null,
            currentUserName: usuario ? usuario.username : null,
            isAuthenticated: isAuthenticated,
            currentPage: 'registro',
            ...navbarConfig,
        });

        console.log('registroControl - Fin');
    } catch (error) {
        console.error('Error en registroControl:', error);
        res.status(500).send('Ocurrió un error al renderizar la página de registro');
    }
};
// user profile view => getUserByEmailQuery
const getProfileControl = async (req, res) => {
    try {
        // Registro de inicio del controlador
        console.log('getPerfil - Inicio');
        
        // Obtiene el correo electrónico del usuario de los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email);

        // Obtiene la información del usuario desde la base de datos utilizando su correo electrónico
        const usuario = await getUserByEmailQuery(email);
        // Registro de la información del usuario obtenida de la base de datos
        console.log('Usuario obtenido de la base de datos:', usuario);

        // Verifica si se encontró al usuario en la base de datos
        if (!usuario) {
            // Registro de que el usuario no fue encontrado
            console.log('Usuario no encontrado');
            // Genera un error y envía una respuesta 404 si el usuario no fue encontrado
            throw new Error('Usuario no encontrado');
            return res.status(404).send('Usuario no encontrado');
        }

        // Registro de los datos del usuario que se pasarán a la vista
        console.log('Datos del usuario pasados a la vista:', usuario);
        
        // Renderiza la vista del perfil del usuario, pasando los datos necesarios al contexto
        res.render('Perfil', {
            user: usuario,
            currentUserEmail: usuario.email,
            currentUserName: usuario.username, // Pasamos el nombre del usuario al contexto
            isAuthenticated: true,
            currentPage: 'perfil',
            showhomeButton: true,
            showContactButton: true,
            showRegisterButton: false,
            showLoginButton: false,            
            showProfileButton: false, 
            showRoomButton: true, 
            showGreetingButton: true,
            showLogoutButton: true,
        });

        // Registro de fin del controlador
        console.log('getPerfil - Fin');
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema durante la ejecución del controlador
        console.error('Error en getPerfil:', error);
        // Envía una respuesta de error 500 junto con un mensaje detallado si ocurre un error
        res.status(500).send('Error al obtener el perfil del usuario: ' + error.message);
    }
};
// update user => updateUserByEmailQuery
const updateUserControl = async (req, res) => { 
    try {
        // Registro de inicio del controlador
        console.log('updateUserControl - Inicio');
        
        // Obtiene el correo electrónico del usuario de los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email);

        // Obtiene los campos actualizados del cuerpo de la solicitud
        const { username, password, tipo_usuario } = req.body;
        // Obtiene la foto de perfil si existe en los archivos adjuntos de la solicitud
        const foto = req.files ? req.files.foto : null;

        // Registro de los datos actualizados del usuario
        console.log('Datos actualizados:', { username, password, tipo_usuario, foto });

        // Verifica si se proporcionó una nueva imagen de perfil
        if (foto) {
            // Obtiene el nombre de la imagen
            const { name } = foto;
            // Define la ruta de almacenamiento de la imagen en el servidor
            const pathPhoto = `img/${name}`;
            // Registro de la ruta de la nueva foto de perfil
            console.log('Ruta de la foto de perfil:', pathPhoto);

            // Mueve la imagen al directorio deseado en el servidor
            foto.mv(`${__dirname}/assets/${pathPhoto}`, async (err) => {
                if (err) {
                    throw new Error('Error al cargar la nueva imagen de perfil');
                }

                // Actualiza el perfil del usuario con la nueva imagen
                const updatedFields = { username, password, tipo_usuario, foto: pathPhoto };
                await updateUserByEmailQuery(email, updatedFields);
                // Registro de la actualización exitosa del perfil con nueva imagen
                console.log('Perfil actualizado correctamente con nueva imagen para:', email);
                // Envía una respuesta 200 indicando que el perfil se actualizó correctamente
                res.status(200).json({ message: 'Perfil actualizado correctamente' });
                // Registro de fin del controlador
                console.log('updateUserControl - Fin');
            });
        } else {
            // Si no se proporcionó una nueva imagen, actualiza solo los otros campos
            const updatedFields = { username, password, tipo_usuario };
            await updateUserByEmailQuery(email, updatedFields);
            // Registro de la actualización exitosa del perfil sin nueva imagen
            console.log('Perfil actualizado correctamente sin nueva imagen para:', email);
            // Envía una respuesta 200 indicando que el perfil se actualizó correctamente
            res.status(200).json({ message: 'Perfil actualizado correctamente' });
            // Registro de fin del controlador
            console.log('updateUserControl - Fin');
        }
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema durante la ejecución del controlador
        console.error('Error en updateUserControl:', error);
        // Envía una respuesta de error 500 junto con un mensaje detallado si ocurre un error
        res.status(500).send('Error al actualizar el perfil del usuario: ' + error.message);
    }
};    
// delete user => deleteUserAndReservationByEmailQuery
const deleteUserAndReservationControl = async (req, res) => {
    try {
        // Registro de inicio del controlador
        console.log('deletePerfilControl - Inicio');
        
        // Obtiene el correo electrónico del usuario de los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email);

        // Elimina el usuario de la base de datos utilizando su correo electrónico
        await deleteUserAndReservationByEmailQuery(email);
        // Registro de la eliminación exitosa del perfil del usuario
        console.log('Usuario eliminado correctamente para:', email);
        // Envía una respuesta 200 indicando que el perfil se eliminó correctamente
        res.status(200).json({ message: 'Perfil eliminado correctamente' });
        // Registro de fin del controlador
        console.log('deletePerfilControl - Fin');
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema durante la ejecución del controlador
        console.error('Error en deletePerfilControl:', error);
        // Envía una respuesta de error 500 junto con un mensaje detallado si ocurre un error
        res.status(500).send('Error al eliminar el perfil del usuario: ' + error.message);
    }
}; 








//RESERVATION

// add reservation => addReservationQuery
const addReservationControl = async (req, res) => {
    try {
        const { fecha_reserva, fecha_salida, numero_habitacion, nombre_usuario } = req.body;

        // Llamar a la función para agregar la reserva
        const reserva = await addReservationQuery(fecha_reserva, fecha_salida, numero_habitacion, nombre_usuario);

        res.status(201).json({ message: 'Reserva agregada con éxito', reserva });
    } catch (error) {
        console.error('Error en addReservationControl:', error);
        res.status(500).send('Error al agregar la reserva: ' + error.message);
    }
};
// reservation registration form view
const getaddReservationControl = async (req, res) => {
    try {
        // Aquí puedes obtener datos adicionales si es necesario, como habitaciones disponibles o clientes
        res.render('AddReservation');
    } catch (error) {
        console.error('Error en renderAddReservaView:', error);
        res.status(500).send('Error al cargar la vista de agregar reserva: ' + error.message);
    }
};
// update reservation => updateReservationQuery
const updateReservationControl = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_reserva, fecha_salida, habitacion_id, cliente_id } = req.body;

        await updateReservationQuery(id, fecha_reserva, fecha_salida, habitacion_id, cliente_id);

        res.status(200).json({ message: 'Reserva actualizada con éxito' });
    } catch (error) {
        console.error('Error en updateReservationControl:', error);
        res.status(500).send('Error al actualizar la reserva: ' + error.message);
    }
};
// delete reservation => deleteReservationQuery
const deleteReservationControl = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteReservationQuery(id);

        res.status(200).json({ message: 'Reserva eliminada con éxito' });
    } catch (error) {
        console.error('Error en deleteReservationControl:', error);
        res.status(500).send('Error al eliminar la reserva: ' + error.message);
    }
};


// ROOM

// add room
const addRoomControl = async (req, res) => {
    try {
        const { numero_habitacion, tipo_habitacion_id, descripcion, precio, disponibilidad } = req.body;
        
        if (!numero_habitacion || !tipo_habitacion_id || !descripcion || !precio || !disponibilidad) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        await addRoomQuery(numero_habitacion, tipo_habitacion_id, descripcion, precio, disponibilidad);
        res.status(201).json({ message: 'Habitación agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar la habitación:', error);
        res.status(500).json({ message: 'Error al agregar la habitación' });
    }
};
// room registration form view
const getAddRoomControl = async (req, res) => {
    try {
        // Aquí no se realiza ninguna acción en el backend, simplemente renderizamos la vista
        res.render('AddRoom'); // Ajusta el nombre de la vista según cómo la hayas definido
    } catch (error) {
        console.error('Error en getAddRoomControl:', error);
        res.status(500).send('Error al cargar la vista de agregar habitación: ' + error.message);
    }
};
// delete room
async function deleteRoomControl(req, res) {
    try {
        const { id } = req.params;
        const habitacionEliminada = await deleteRoomQuery(id);
        res.status(200).json(habitacionEliminada);
    } catch (error) {
        console.error('Error al eliminar la habitación:', error);
        res.status(500).send('Error al eliminar la habitación');
    }
}






// customer view => getUserByEmailQuery => getUsersQuery => getReservationQuery => getRoomQuery
const getCustomerInicio = async (req, res) => {
    try {
        // Registro del inicio del controlador
        console.log('getCustomerInicio - Inicio');
        
        // Extrae el parámetro "email" de la ruta
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email); 
        
        // Obtiene el usuario de la base de datos utilizando su correo electrónico
        const usuario = await getUserByEmailQuery(email);
        // Registro del usuario obtenido de la base de datos
        console.log('Usuario obtenido de la base de datos:', usuario);

        // Verifica si el usuario no existe o no es un customer
        if (!usuario || (usuario.tipo_usuario !== 'customer' && usuario.tipo_usuario !== 'cliente')) {
            console.log('Usuario no encontrado o no es customer');
            // Retorna una respuesta 404 si el usuario no se encuentra o no es un customer
            return res.status(404).send('Usuario no encontrado o no es customer');
        }

        // Obtiene la lista de usuarios, reservas y habitaciones de la base de datos
        const usuarios = await getUsersQuery();
        const reservas = await getReservationQuery();
        const habitaciones = await getRoomQuery();

        // Verifica si no se encontraron usuarios, reservas o habitaciones
        if (!usuarios) {
            console.log('Usuarios no encontrados');
            throw new Error('Usuarios no encontrados');
            return res.status(404).send('Usuarios no encontrados');
        }
        if (!reservas) {
            console.log('Reservas no encontradas');
            throw new Error('Reservas no encontradas');
            return res.status(404).send('Reservas no encontradas');
        }
        if (!habitaciones) {
            console.log('Habitaciones no encontradas');
            throw new Error('Habitaciones no encontradas');
            return res.status(404).send('Habitaciones no encontradas');
        }
        
        // Registro de los datos obtenidos para la vista de customer
        console.log('Datos obtenidos para la vista de customer:', { usuarios, reservas, habitaciones });
        // Renderiza la página de customer con los datos obtenidos
        res.render('Customer', { 
            usuarios, 
            reservas, 
            habitaciones,
            user: usuario,
            currentUserEmail: usuario.email,
            currentUserName: usuario.username, // Pasamos el nombre del usuario al contexto
            isAuthenticated: true,
            currentPage: 'Admin',
            showhomeButton: true,
            showContactButton: true,
            showRegisterButton: false,
            showLoginButton: false,            
            showProfileButton: true, 
            showRoomButton: false, 
            showGreetingButton: true,
            showLogoutButton: true,
        });
        // Registro del fin del controlador
        console.log('getCustomerInicio - Fin');
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema durante la ejecución del controlador
        console.error('Error en getCustomerInicio:', error);
        // Envía una respuesta de error 500 junto con un mensaje detallado si ocurre un error
        res.status(500).send('Error al obtener los datos getCustomerInicio: ' + error.message);
    }
}; 
// administrator view => getUserByEmailQuery => getUsersQuery => getReservationQuery => getRoomQuery
const getAdminInicio = async (req, res) => {
    try {
        // Registro del inicio del controlador
        console.log('getAdminInicio - Inicio');
        
        // Extrae el parámetro "email" de la ruta
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email); 
        
        // Obtiene el usuario de la base de datos utilizando su correo electrónico
        const usuario = await getUserByEmailQuery(email);
        // Registro del usuario obtenido de la base de datos
        console.log('Usuario obtenido de la base de datos:', usuario);

        // Verifica si el usuario no existe o no es un administrator
        if (!usuario || (usuario.tipo_usuario !== 'administrator' && usuario.tipo_usuario !== 'admin')) {
            console.log('Usuario no encontrado o no es administrator');
            // Retorna una respuesta 404 si el usuario no se encuentra o no es un administrator
            return res.status(404).send('Usuario no encontrado o no es administrator');
        }

        // Obtiene la lista de usuarios, reservas y habitaciones de la base de datos
        const usuarios = await getUsersQuery();
        const reservas = await getReservationQuery();
        const habitaciones = await getRoomQuery();

        // Verifica si no se encontraron usuarios, reservas o habitaciones
        if (!usuarios) {
            console.log('Usuarios no encontrados'); // avisa consola y sigue ejecucion
            throw new Error('Usuarios no encontrados'); // avisa consola y detiene ejecucion
            return res.status(404).send('Usuarios no encontrados');// avisa navegador y detiene ejecucion
        }
        if (!reservas) {
            console.log('Reservas no encontradas');
            throw new Error('Reservas no encontradas'); // comentar para mostra tabla vacia
            return res.status(404).send('Reservas no encontradas'); // comentar para mostra tabla vacia
        }
        if (!habitaciones) {
            console.log('Habitaciones no encontradas');
            throw new Error('Habitaciones no encontradas'); // comentar para mostra tabla vacia
            return res.status(404).send('Habitaciones no encontradas'); // comentar para mostra tabla vacia
        }
        
        // Registro de los datos obtenidos para la vista de administrator
        console.log('Datos obtenidos para la vista de admin:', { usuarios, reservas, habitaciones });
        // Renderiza la página de administrator con los datos obtenidos
        res.render('Admin', { 
            usuarios: usuarios || [], 
            reservas: reservas || [], 
            habitaciones: habitaciones || [],
            user: usuario,
            currentUserEmail: usuario.email,
            currentUserName: usuario.username, // Pasamos el nombre del usuario al contexto
            isAuthenticated: true,
            currentPage: 'Admin',
            showhomeButton: true,
            showContactButton: true,
            showRegisterButton: false,
            showLoginButton: false,            
            showProfileButton: true, 
            showRoomButton: false, 
            showGreetingButton: true,
            showLogoutButton: true,
        });
        // Registro del fin del controlador
        console.log('getAdminInicio - Fin');
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema durante la ejecución del controlador
        console.error('Error en getAdminInicio:', error);
        // Envía una respuesta de error 500 junto con un mensaje detallado si ocurre un error
        res.status(500).send('Error al obtener los datos getAdminInicio: ' + error.message);
    }
}; 
// get and update a user in a modal => getUserByEmailQuery
const getUpdateUserModalAdmin = async (req, res) => {
    try {
        // Registro del inicio del controlador
        console.log('getPerfilAdmin - Inicio');

        // Obtener el correo electrónico del usuario desde los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email);

        // Consultar la base de datos para obtener el usuario correspondiente al correo electrónico
        const usuario = await getUserByEmailQuery(email);
        // Registro del usuario obtenido de la base de datos
        console.log('Usuario obtenido de la base de datos:', usuario);

        // Si no se encuentra ningún usuario, devolver un error 404
        if (!usuario) {
            console.log('Usuario no encontrado');
            return res.status(404).send('Usuario no encontrado');
        }

        // Imprimir los datos del usuario que se enviarán a la vista perfil-admin
        console.log('Datos del usuario pasados a la vista perfil-admin:', usuario);

        // Definir una variable para mostrar u ocultar el botón de administración
        const showAdminButton = true;
        // Imprimir el valor de la variable showAdminButton
        console.log('Valor de showAdminButton:', showAdminButton);

        // Enviar los datos del usuario como JSON al frontend
        res.status(200).json(usuario);

        // Registro del fin del controlador
        console.log('getPerfilAdmin - Fin');
    } catch (error) {
        // Capturar cualquier error que ocurra durante el proceso
        console.error('Error en getPerfilAdmin:', error);
        // Enviar un mensaje de error al frontend junto con el código de estado 500
        res.status(500).send('Error al obtener el perfil del usuario: ' + error.message);
    }
};
// Get and update reservation details in a modal => getReservationByEmailQuery
const getUpdateReservationModalAdmin = async (req, res) => {
    try {
        // Registro del inicio del controlador
        console.log('getUpdateReservationModalAdmin - Inicio');

        // Obtener el correo electrónico del usuario desde los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email);

        // Consultar la base de datos para obtener las reservas asociadas al correo electrónico del usuario
        const reservas = await getReservationByEmailQuery(email);
        // Registro de las reservas obtenidas de la base de datos
        console.log('Reservas obtenidas de la base de datos:', reservas);

        // Si no se encuentra ninguna reserva, devolver un error 404
        if (!reservas || reservas.length === 0) {
            console.log('Reservas no encontradas');
            return res.status(404).send('Reservas no encontradas');
        }

        // Enviar los detalles de la reserva como JSON al frontend
        res.status(200).json(reservas);

        // Registro del fin del controlador
        console.log('getUpdateReservationModalAdmin - Fin');
    } catch (error) {
        // Capturar cualquier error que ocurra durante el proceso
        console.error('Error en getUpdateReservationModalAdmin:', error);
        // Enviar un mensaje de error al frontend junto con el código de estado 500
        res.status(500).send('Error al obtener los detalles de la reserva: ' + error.message);
    }
};



console.log('ApiRestFull.js - Configuración de controllers completa');

export { 
    getHomeControl,
    
    getLoginControl,
    postLoginControl,
    logoutControl,

    getContactControl,
    postSendContactControl,

    addUserRegistrationControl,
    getUserRegistrationControl,
    getProfileControl,
    updateUserControl,
    deleteUserAndReservationControl,

    addReservationControl, 
    getaddReservationControl,         
    updateReservationControl,
    deleteReservationControl, 

    addRoomControl,
    getAddRoomControl,
    deleteRoomControl,
    
    getCustomerInicio,
    
    getAdminInicio,
    getUpdateUserModalAdmin,
    getUpdateReservationModalAdmin      
 };