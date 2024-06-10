// routes.js
import { Router } from 'express';
import {
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
} from '../src/controllers/ApiRestFull.js';
import { verifyToken } from '../middlewares/token.js';

const router = Router();

console.log('routes.js - Iniciando configuración de rutas');

// Ruta por defecto para la página de inicio de cliente y administrador
router.get('/', getHomeControl);

// Rutas para el controlador de inicio y cierre de sesión de cliente y administrador
router.get('/login', getLoginControl);
router.post('/login', postLoginControl);
router.get('/logout', logoutControl);

// Ruta para la vista de contacto de cliente y administrador
router.get('/contacto', getContactoControl);
router.post('/contacto', postEnviarContactoControl);

// Rutas para el controlador de agregar usuarios y vista registro de perfil cliente
router.post('/registro', addUsuarioRegistroControl); //ruta no visible en navegador, puedes ver en Postman o Thunder Client
router.get('/registro', getUsuarioRegistroControl);

// Ruta para ver las habitaciones y reservar una habitación de perfil cliente 
router.get('/habitaciones/:email', verifyToken, getReservaHabitacionesControl);
router.post('/habitaciones/reserva/:habitacionId', verifyToken, reservarHabitacionControl);
router.post('/habitaciones/eliminar-reserva/:habitacionId', verifyToken, eliminarReservaHabitacionControl);

// Ruta para el controlador de perfil cliente
router.get('/perfil/:email', verifyToken, getPerfilControl);
router.put('/perfil/:email', verifyToken, updatePerfilControl);
router.delete('/perfil/:email', verifyToken, deletePerfilControl);

// Rutas para controladores de administrador
router.get('/admin/inicio/:email', verifyToken, getAdminInicio);
router.delete('/admin/perfil/:email', verifyToken, deletePerfilAndReservasAdminControl);
router.get('/admin/perfil/:email', verifyToken, getPutPerfilModalAdmin);
router.get('/admin/registro', verifyToken, getUsuarioRegistroAdminControl);


console.log('routes.js - Configuración de rutas completa');

export default router;
