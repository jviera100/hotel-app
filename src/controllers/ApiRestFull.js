// ApiRestFull.js
import path from 'path';
import { 
    addUsuarioQuery, 
    getUsuariosQuery,
    updateDisponibilidadHabitacionQuery,     
    getReservasQuery,
    getReservasByEmailQuery,
    getHabitacionesQuery, 
    getHabitacionesDisponiblesQuery,
    getHabitacionesNoDisponiblesQuery, 
    getUsuarioByEmailQuery, 
    updateUsuarioByEmailQuery, 
    deletePerfilAndReservasByEmailQuery      
 } from '../queries/consultaSQL.js';
import jwt from 'jsonwebtoken';

const __dirname = path.resolve();

console.log('ApiRestFull.js - Iniciando configuración de controllers');

// Definición del controlador para la página de inicio
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





// Definición del controlador para agregar un nuevo usuario
const addUsuarioRegistroControl = async (req, res) => {
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
            await addUsuarioQuery(usuario);
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


// Definición del controlador para renderizar la página de registro
const getUsuarioRegistroControl = (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('registroControl - Inicio');
        
        // Renderiza la página de registro con los siguientes parámetros
        res.render("Registro", {
            currentPage: 'registro', // Página actual: registro
            isAuthenticated: !!req.cookies.token, // Indica si el usuario está autenticado mediante un token
            showhomeButton: true, // Mostrar botón de inicio en la barra de navegación
            showContactButton: true, // Mostrar botón de contacto en la barra de navegación
            showRegisterButton: false, // Ocultar botón de registro en la barra de navegación
            showLoginButton: true, // Mostrar botón de inicio de sesión en la barra de navegación
            showProfileButton: false, // Ocultar botón de perfil en la barra de navegación
            showRoomButton: false, // Ocultar botón de habitaciones en la barra de navegación
            showGreetingButton: false, // Ocultar mensaje de bienvenida en la barra de navegación
            showLogoutButton: false, // Ocultar botón de cierre de sesión en la barra de navegación
        });

        // Registro de finalización del controlador en la consola
        console.log('registroControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el proceso
        console.error('Error en registroControl:', error); // Registro del error en la consola de errores
        res.status(500).send('Ocurrió un error al renderizar la página de registro'); // Envía una respuesta de error HTTP con un mensaje de error
    }
};


// Controlador para renderizar la vista de inicio de sesión
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


// Controlador para procesar el inicio de sesión
const postLoginControl = async (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('postLoginControl - Inicio');
        
        // Extrae el correo electrónico y la contraseña del cuerpo de la solicitud
        const { email, password } = req.body;
        console.log('Intento de inicio de sesión para:', email);

        // Busca al usuario en la base de datos utilizando su correo electrónico
        const usuario = await getUsuarioByEmailQuery(email);
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
        if (usuario.tipo_usuario === 'administrador' || usuario.tipo_usuario === 'admin') {
            console.log(`Redirigiendo a /admin para el usuario ${usuario.email}`);
            res.redirect(`/admin/inicio/${email}`);
        } else {
            console.log(`Redirigiendo a /habitaciones/${email} para el usuario ${usuario.email}`);
            res.redirect(`/habitaciones/${email}`);
        }

        // Registro de finalización del controlador en la consola
        console.log('postLoginControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el proceso
        console.error('Error al procesar el inicio de sesión:', error); // Registro del error en la consola de errores
        res.status(500).send('Ocurrió un error al iniciar sesión: ' + error.message); // Envía una respuesta de error HTTP con un mensaje de error
    }
};


// Controlador para la vista de habitaciones
const getReservaHabitacionesControl = async (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('habitacionesControl - Inicio');
        
        // Obtiene el token de autenticación de las cookies de la solicitud
        const token = req.cookies.token;
        
        // Decodifica el token para obtener el correo electrónico del usuario
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email;
        console.log('Email del usuario decodificado del token:', email);

        // Obtiene las habitaciones disponibles y las reservas del usuario de la base de datos
        const habitacionesDisponibles = await getHabitacionesDisponiblesQuery();
        const reservasUsuario = await getReservasQuery(email);
        const usuario = await getUsuarioByEmailQuery(email);
        console.log('Habitaciones disponibles obtenidas:', habitacionesDisponibles);
        console.log('Reservas del usuario:', reservasUsuario);
        
        // Renderiza la vista de habitaciones con los datos obtenidos
        res.render('Habitaciones', {             
            habitaciones: habitacionesDisponibles, // Lista de habitaciones disponibles
            reservasUsuario: reservasUsuario, // Reservas del usuario actual
            user: usuario,// Información del usuario
            currentUserEmail: usuario.email,
            currentUserName: usuario.username, // Pasamos el nombre del usuario al contexto boton saludo
            isAuthenticated: true, // Indica si el usuario está autenticado
            currentPage: 'Habitaciones', // Página actual
            showhomeButton: true, // Mostrar botón de inicio
            showContactButton: true, // Mostrar botón de contacto
            showRegisterButton: false, // Ocultar botón de registro
            showLoginButton: false, // Ocultar botón de inicio de sesión
            showProfileButton: true, // Mostrar botón de perfil
            showRoomButton: false, // Ocultar botón de habitaciones
            showGreetingButton: true, // Mostrar botón de saludo
            showLogoutButton: true, // Mostrar botón de cierre de sesión
        });

        // Registro de finalización del controlador en la consola
        console.log('habitacionesControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el proceso
        console.error('Error en habitacionesControl:', error); // Registro del error en la consola de errores
        res.status(500).send('Error al obtener los datos de las habitaciones: ' + error.message); // Envía una respuesta de error HTTP con un mensaje de error
    }
};

// Controlador para actualizar la disponibilidad de la habitación (reservar)
const reservarHabitacionControl = async (req, res) => {
    try {
        const { habitacionId } = req.params;

        // Actualizar la disponibilidad de la habitación a no disponible
        await updateDisponibilidadHabitacionQuery(habitacionId, false);

        res.status(200).json({ message: 'Habitación reservada con éxito' });
    } catch (error) {
        console.error('Error en reservarHabitacionControl:', error);
        res.status(500).send('Error al reservar la habitación: ' + error.message);
    }
};

// Controlador para actualizar la disponibilidad de la habitación (eliminar reserva)
const eliminarReservaHabitacionControl = async (req, res) => {
    try {
        const { habitacionId } = req.params;

        // Actualizar la disponibilidad de la habitación a disponible
        await updateDisponibilidadHabitacionQuery(habitacionId, true);

        res.status(200).json({ message: 'Reserva eliminada con éxito' });
    } catch (error) {
        console.error('Error en eliminarReservaHabitacionControl:', error);
        res.status(500).send('Error al eliminar la reserva: ' + error.message);
    }
};
// Controlador para actualizar una reserva
const updateReservaControl = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_reserva, fecha_salida, habitacion_numero, nombre_usuario } = req.body;

        const query = {
            text: "UPDATE reservas SET fecha_reserva = $1, fecha_salida = $2, habitacion_numero = $3, nombre_usuario = $4 WHERE id = $5 RETURNING *",
            values: [fecha_reserva, fecha_salida, habitacion_numero, nombre_usuario, id]
        };

        const result = await pool.query(query);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: `Error al actualizar la reserva: ${error.message}` });
    }
};
  
  


// Controlador para obtener el perfil de un usuario
const getPerfilControl = async (req, res) => {
    try {
        // Registro de inicio del controlador
        console.log('getPerfil - Inicio');
        
        // Obtiene el correo electrónico del usuario de los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email);

        // Obtiene la información del usuario desde la base de datos utilizando su correo electrónico
        const usuario = await getUsuarioByEmailQuery(email);
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


// Controlador para actualizar el perfil de un usuario
const updatePerfilControl = async (req, res) => { 
    try {
        // Registro de inicio del controlador
        console.log('updatePerfilControl - Inicio');
        
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
                await updateUsuarioByEmailQuery(email, updatedFields);
                // Registro de la actualización exitosa del perfil con nueva imagen
                console.log('Perfil actualizado correctamente con nueva imagen para:', email);
                // Envía una respuesta 200 indicando que el perfil se actualizó correctamente
                res.status(200).json({ message: 'Perfil actualizado correctamente' });
                // Registro de fin del controlador
                console.log('updatePerfilControl - Fin');
            });
        } else {
            // Si no se proporcionó una nueva imagen, actualiza solo los otros campos
            const updatedFields = { username, password, tipo_usuario };
            await updateUsuarioByEmailQuery(email, updatedFields);
            // Registro de la actualización exitosa del perfil sin nueva imagen
            console.log('Perfil actualizado correctamente sin nueva imagen para:', email);
            // Envía una respuesta 200 indicando que el perfil se actualizó correctamente
            res.status(200).json({ message: 'Perfil actualizado correctamente' });
            // Registro de fin del controlador
            console.log('updatePerfilControl - Fin');
        }
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema durante la ejecución del controlador
        console.error('Error en updatePerfilControl:', error);
        // Envía una respuesta de error 500 junto con un mensaje detallado si ocurre un error
        res.status(500).send('Error al actualizar el perfil del usuario: ' + error.message);
    }
}; 
          
      

// Controlador para eliminar el perfil de un usuario
const deletePerfilControl = async (req, res) => {
    try {
        // Registro de inicio del controlador
        console.log('deletePerfilControl - Inicio');
        
        // Obtiene el correo electrónico del usuario de los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email);

        // Elimina el usuario de la base de datos utilizando su correo electrónico
        await deletePerfilAndReservasByEmailQuery(email);
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

// Definición del controlador para la página de contacto
const getContactoControl = (req, res) => {
    try {
        // Registro de inicio del controlador en la consola
        console.log('getContactoControl - Inicio');
        
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
        console.log('getContactoControl - Fin');
    } catch (error) {
        // Manejo de errores: si ocurre un error durante el procesamiento de la solicitud
        console.error('Error en getContactoControl:', error); // Registro del error en la consola de errores
        res.status(500).send('Ocurrió un error al renderizar la página de contacto'); // Envía una respuesta de error HTTP con el mensaje de error detallado
    }
};


// Definición del controlador para enviar el formulario de contacto
const postEnviarContactoControl = (req, res) => {
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


// Controlador para obtener la página de inicio del administrador
const getAdminInicio = async (req, res) => {
    try {
        // Registro del inicio del controlador
        console.log('getAdminInicio - Inicio');
        
        // Extrae el parámetro "email" de la ruta
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email); 
        
        // Obtiene el usuario de la base de datos utilizando su correo electrónico
        const usuario = await getUsuarioByEmailQuery(email);
        // Registro del usuario obtenido de la base de datos
        console.log('Usuario obtenido de la base de datos:', usuario);

        // Verifica si el usuario no existe o no es un administrador
        if (!usuario || (usuario.tipo_usuario !== 'administrador' && usuario.tipo_usuario !== 'admin')) {
            console.log('Usuario no encontrado o no es administrador');
            // Retorna una respuesta 404 si el usuario no se encuentra o no es un administrador
            return res.status(404).send('Usuario no encontrado o no es administrador');
        }

        // Obtiene la lista de usuarios, reservas y habitaciones de la base de datos
        const usuarios = await getUsuariosQuery();
        const reservas = await getReservasQuery();
        const habitaciones = await getHabitacionesQuery();

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
        
        // Registro de los datos obtenidos para la vista de administrador
        console.log('Datos obtenidos para la vista de admin:', { usuarios, reservas, habitaciones });
        // Renderiza la página de administrador con los datos obtenidos
        res.render('Admin', { 
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
        console.log('getAdminInicio - Fin');
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema durante la ejecución del controlador
        console.error('Error en getAdminInicio:', error);
        // Envía una respuesta de error 500 junto con un mensaje detallado si ocurre un error
        res.status(500).send('Error al obtener los datos getAdminInicio: ' + error.message);
    }
}; 

// Controlador para obtener y actualizar el perfil de un usuario en forma de modal para administradores
const getPutPerfilModalAdmin = async (req, res) => {
    try {
        // Registro del inicio del controlador
        console.log('getPerfilAdmin - Inicio');

        // Obtener el correo electrónico del usuario desde los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del usuario
        console.log('Email del usuario:', email);

        // Consultar la base de datos para obtener el usuario correspondiente al correo electrónico
        const usuario = await getUsuarioByEmailQuery(email);
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
// Controlador para eliminar el perfil de un usuario
const deletePerfilAndReservasAdminControl = async (req, res) => {
    try {
        // Registro de inicio del controlador
        console.log('deletePerfilAndReservasAdminControl - Inicio');
        
        // Obtiene el correo electrónico del administrador de los parámetros de la solicitud
        const { email } = req.params;
        // Registro del correo electrónico del administrador
        console.log('Email del administrador:', email);

        // Ejecuta la eliminación combinada de reservas y perfil de administrador
        await deletePerfilAndReservasByEmailQuery(email);
        
        // Registro de la eliminación exitosa del perfil del administrador
        console.log('Perfil de administrador eliminado correctamente para:', email);
        
        // Envía una respuesta 200 indicando que el perfil se eliminó correctamente
        res.status(200).json({ message: 'Perfil de administrador eliminado correctamente' });
        
        // Registro de fin del controlador
        console.log('deletePerfilAndReservasAdminControl - Fin');
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema durante la ejecución del controlador
        console.error('Error en deletePerfilAndReservasAdminControl:', error);
        
        // Envía una respuesta de error 500 junto con un mensaje detallado si ocurre un error
        res.status(500).send('Error al eliminar el perfil del administrador: ' + error.message);
    }
};

// Controlador para mostrar la vista de registro de administradores
const getUsuarioRegistroAdminControl = async (req, res) => {
    try {
        // Registro del inicio del controlador
        console.log('registroAdminControl - Inicio');  

        // Extraer el email del usuario autenticado desde el token decodificado     
        const { email } = req.user;
        // Registro del email del usuario
        console.log('Email del usuario:', email);
        
        // Obtener el usuario de la base de datos utilizando el email
        const usuario = await getUsuarioByEmailQuery(email);
        // Registro del usuario obtenido de la base de datos
        console.log('Usuario obtenido de la base de datos:', usuario);

        // Si no se encuentra el usuario, retorna un error 404
        if (!usuario) {
            console.log('Usuario no encontrado');            
            return res.status(404).send('Usuario no encontrado');
        }

        // Registro de los datos del usuario que se pasarán a la vista admin/registro
        console.log('Datos del usuario pasados a la vista admin/registro:', usuario);

        // Definir una variable para mostrar u ocultar el botón de administración
        const showAdminButton = true;

        // Imprimir el valor de showAdminButton
        console.log('Valor de showAdminButton:', showAdminButton);

        // Renderizar la vista de registro con los datos del usuario y los botones del navbar adecuados
        res.render("Registro", {
            user: usuario,
            currentUserEmail: usuario.email,
            currentUserName: usuario.username, // Pasar el nombre del usuario al contexto
            isAuthenticated: true,
            currentPage: 'admin/registro',
            showhomeButton: true,
            showContactButton: true,
            showRegisterButton: false,
            showLoginButton: false,            
            showProfileButton: true, 
            showRoomButton: false, 
            showGreetingButton: true,
            showAdminButton: true,
            showLogoutButton: true,
        });

        // Registro del fin del controlador
        console.log('registroAdminControl - Fin');
    } catch (error) {
        // Capturar cualquier error que ocurra durante el proceso
        console.error('Error en registroAdminControl:', error);
        // Enviar un mensaje de error al frontend junto con el código de estado 500
        res.status(500).send('Ocurrió un error al renderizar la página de registro para administradores');
    }
};


// Controlador para cerrar sesión
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


console.log('ApiRestFull.js - Configuración de controllers completa');

export { 
    getHomeControl,    
    addUsuarioRegistroControl,
    getUsuarioRegistroControl,
    getLoginControl,
    postLoginControl,
    getReservaHabitacionesControl,
    reservarHabitacionControl,
    eliminarReservaHabitacionControl,
    updateReservaControl,
    getPerfilControl,
    updatePerfilControl,
    deletePerfilControl,
    getContactoControl,
    postEnviarContactoControl,
    getAdminInicio,
    getPutPerfilModalAdmin,
    deletePerfilAndReservasAdminControl,    
    getUsuarioRegistroAdminControl,    
    logoutControl
 };
