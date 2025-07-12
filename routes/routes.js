// routes.js (HTTP requests)
import { verifyToken } from '../middlewares/token.js';
import { checkAdmin, checkOwnershipOrAdmin } from '../middlewares/auth.js'; // Importa los middlewares de autorización.

const router = Router();

// routes (get) are visible in the browser, routes (post-put-delete) you can see in Postman or Thunder Client extensions
// number of routes = number of controllers

console.log('routes.js - Iniciando configuración de rutas');

// Routes to home page
router.get('/', getHomeControl);

// Routes for login and logout handler 🔐🪪
router.get('/login', getLoginControl);
router.post('/login', postLoginControl); // getUserByEmailQuery
router.get('/logout', logoutControl);

// Routes for contact view

// Configurar el transporte SMTP 🪛
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Definir las opciones del correo electrónico 📧
  const mailOptions = (to, name, message) => ({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Confirmación de Contacto',
    text: `Hola ${name}, hemos recibido tu mensaje: "${message}". Nos pondremos en contacto contigo pronto.`,
});

router.get('/contacto', getContactControl);
router.post('/contacto', async (req, res) => {
    try {
        // Procesar el envío del formulario de contacto
        const { nombre, email, mensaje } = req.body;
        await postSendContactControl(req, res);        

        // Configurar opciones del correo
        const createMailOptions = mailOptions(email, nombre, mensaje);

        // Enviar el correo electrónico
        transporter.sendMail(createMailOptions, (error, info) => {
            if (error) {
                console.error("Error al enviar el correo electrónico 📧:", error);
                res.status(500).send("Error al enviar el correo electrónico");
            } else {
                console.log("Correo electrónico enviado📧:", info.response);
                res.send("Correo electrónico enviado correctamente");
            }
        });
    } catch (error) {
        console.error("Error al procesar la solicitud📧:", error);
        res.status(500).send("Ocurrió un error al procesar la solicitud");
    }
});

// Routes for users controllers 🪛🔐🪪
router.post('/registro', addUserRegistrationControl); // addUserQuery
router.get('/registro', getUserRegistrationControl); // getUserByEmailQuery
// Rutas de perfil de usuario protegidas: solo el propietario o un administrador pueden acceder/modificar.
router.get('/perfil/:email', verifyToken, checkOwnershipOrAdmin, getProfileControl); // getUserByEmailQuery
router.put('/perfil/:email', verifyToken, checkOwnershipOrAdmin, updateUserControl); // updateUserByEmailQuery
// Ruta para eliminar usuario: solo accesible por administradores.
router.delete('/perfil/:email', verifyToken, checkAdmin, deleteUserAndReservationControl); // deleteUserAndReservationByEmailQuery

// Routes for reservation controllers 🪛🔐🪪🗓️
router.post('/reserva', verifyToken, addReservationControl); // addReservationQuery 
router.get('/reservation-add', verifyToken, getaddReservationControl);
router.put('/reserva/:id', verifyToken, updateReservationControl); // updateReservationQuery 
router.delete('/reserva/:id', verifyToken, deleteReservationControl); // deleteReservationQuery 

// Routes for rooms controllers 🪛🔐🪪🏨🛌🏽🛎️
// Rutas de habitaciones protegidas: solo accesibles por administradores.
router.post('/room', verifyToken, checkAdmin, addRoomControl); // addRoomQuery 
router.get('/room-add', verifyToken, getAddRoomControl);
router.delete('/room/:id', verifyToken, checkAdmin, deleteRoomControl); // deleteRoomQuery 

// Routes for client controllers 🪛🔐🪪🗓️🏨🛌🏽🛎️
router.get('/customer/inicio/:email', verifyToken, getCustomerInicio);// getUserByEmailQuery => getUsersQuery => getReservationByEmailQuery => getRoomQuery

// Routes for administrator controllers 🪛🔐🪪🗓️🏨🛌🏽🛎️
// Todas las rutas de administrador están protegidas por el middleware checkAdmin.
router.get('/admin/inicio/:email', verifyToken, checkAdmin, getAdminInicio);// getUserByEmailQuery => getUsersQuery => getReservationQuery => getRoomQuery
router.get('/admin/perfil/:email', verifyToken, checkAdmin, getUpdateUserModalAdmin);// getUserByEmailQuery
router.get('/admin/reserva/:email', verifyToken, checkAdmin, getUpdateReservationModalAdmin);// getReservationByEmailQuery => no se usara

console.log('routes.js - Configuración de rutas completa');

export default router;
