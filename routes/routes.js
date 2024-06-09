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

// Ruta por defecto para la página de inicio
router.get('/', getHomeControl);

// Rutas para el controlador de agregar usuarios y vista registro
router.post('/registro', addUsuarioRegistroControl); //ruta no visible en navegador, puedes ver en Postman o Thunder Client
router.get('/registro', getUsuarioRegistroControl);

// Rutas para el controlador de inicio de sesión
router.get('/login', getLoginControl);
router.post('/login', postLoginControl);

// Ruta para la vista de habitaciones de un perfil cliente específico y reservar una habitación
router.get('/habitaciones/:email', verifyToken, getReservaHabitacionesControl);
router.post('/habitaciones/reserva/:habitacionId', verifyToken, reservarHabitacionControl);
router.post('/habitaciones/eliminar-reserva/:habitacionId', verifyToken, eliminarReservaHabitacionControl);

// Ruta para el controlador de perfil cliente
router.get('/perfil/:email', verifyToken, getPerfilControl);
router.put('/perfil/:email', verifyToken, updatePerfilControl);
router.delete('/perfil/:email', verifyToken, deletePerfilControl);

// Ruta para la vista de contacto
router.get('/contacto', getContactoControl);
router.post('/contacto', postEnviarContactoControl);

// Rutas para controladores de administrador
router.get('/admin/inicio/:email', verifyToken, getAdminInicio);
router.delete('/admin/perfil/:email', verifyToken, deletePerfilAndReservasAdminControl);
router.get('/admin/perfil/:email', verifyToken, getPutPerfilModalAdmin);
router.get('/admin/registro', verifyToken, getUsuarioRegistroAdminControl);

router.get('/admin/inicio/:email', verifyToken, getReservaHabitacionesControl);
router.post('/admin/habitaciones/reserva/:habitacionId', verifyToken, reservarHabitacionControl);
router.post('/admin/habitaciones/eliminar-reserva/:habitacionId', verifyToken, eliminarReservaHabitacionControl);
router.put('/admin/habitaciones/actualizar-reserva/:habitacionId', verifyToken, updateReservaControl);

// Ruta para el cierre de sesión
router.get('/logout', logoutControl);

console.log('routes.js - Configuración de rutas completa');

export default router;
