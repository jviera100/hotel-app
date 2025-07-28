// routes.js (HTTP requests)
import { Router } from 'express';
import { verifyToken } from '../middlewares/token.js';
import { checkAdmin, checkOwnershipOrAdmin } from '../middlewares/auth.js';
import { verifyCsrfToken } from '../middlewares/csrf.js';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// Import all controllers
import {
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
} from '../src/controllers/ApiRestFull.js';

const router = Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// --- Route Validators ---

const loginValidators = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 1 }).withMessage('Password cannot be empty'),
];

const contactValidators = [
    body('nombre').trim().escape().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('mensaje').trim().escape().notEmpty().withMessage('Message is required'),
];

const userRegistrationValidators = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('username').trim().escape().notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const updateUserValidators = [
    body('username').optional().trim().escape(),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('tipo_usuario').optional().trim().escape(),
];

const reservationValidators = [
    body('fecha_reserva').isISO8601().toDate().withMessage('Invalid reservation date'),
    body('fecha_salida').isISO8601().toDate().withMessage('Invalid departure date'),
    body('numero_habitacion').isInt().withMessage('Room number must be an integer'),
    body('nombre_usuario').trim().escape().notEmpty().withMessage('Username is required'),
];

const roomValidators = [
    body('numero_habitacion').isInt().withMessage('Room number must be an integer'),
    body('tipo_habitacion_id').isInt().withMessage('Room type ID must be an integer'),
    body('descripcion').trim().escape().notEmpty().withMessage('Description is required'),
    body('precio').isDecimal().withMessage('Price must be a decimal value'),
    body('disponibilidad').isBoolean().withMessage('Availability must be a boolean'),
];


// --- Routes ---

console.log('routes.js - Initializing route configuration');

// Home page
router.get('/', getHomeControl);

// Login and logout
router.get('/login', getLoginControl);
router.post('/login', loginLimiter, loginValidators, handleValidationErrors, postLoginControl);
router.get('/logout', logoutControl);

// Contact view and form submission
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

const mailOptions = (to, name, message) => ({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Contact Confirmation',
    text: `Hello ${name}, we have received your message: "${message}". We will contact you shortly.`,
});

router.get('/contacto', getContactControl);
router.post('/contacto', contactValidators, handleValidationErrors, async (req, res) => {
    try {
        await postSendContactControl(req, res);
        const { nombre, email, mensaje } = req.body;
        const createMailOptions = mailOptions(email, nombre, mensaje);
        transporter.sendMail(createMailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email 📧:", error);
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent 📧:", info.response);
                res.send("Email sent successfully");
            }
        });
    } catch (error) {
        console.error("Error processing request 📧:", error);
        res.status(500).send("An error occurred while processing the request");
    }
});

// User management
router.post('/registro', userRegistrationValidators, handleValidationErrors, addUserRegistrationControl);
router.get('/registro', getUserRegistrationControl);
router.get('/perfil/:email', verifyToken, checkOwnershipOrAdmin, getProfileControl);
router.put('/perfil/:email', verifyToken, checkOwnershipOrAdmin, updateUserValidators, handleValidationErrors, updateUserControl);
router.delete('/perfil/:email', verifyToken, checkAdmin, deleteUserAndReservationControl);

// Reservation management
router.post('/reserva', verifyToken, reservationValidators, handleValidationErrors, addReservationControl);
router.get('/reservation-add', verifyToken, getaddReservationControl);
router.put('/reserva/:id', verifyToken, reservationValidators, handleValidationErrors, updateReservationControl);
router.delete('/reserva/:id', verifyToken, deleteReservationControl);

// Room management (Admin only)
router.post('/room', verifyToken, checkAdmin, roomValidators, handleValidationErrors, addRoomControl);
router.get('/room-add', verifyToken, getAddRoomControl);
router.delete('/room/:id', verifyToken, checkAdmin, verifyCsrfToken, deleteRoomControl);

// Customer and Admin views
router.get('/customer/inicio/:email', verifyToken, getCustomerInicio);
router.get('/admin/inicio/:email', verifyToken, checkAdmin, getAdminInicio);
router.get('/admin/perfil/:email', verifyToken, checkAdmin, getUpdateUserModalAdmin);
router.get('/admin/reserva/:email', verifyToken, checkAdmin, getUpdateReservationModalAdmin);

console.log('routes.js - Route configuration complete');

export default router;

