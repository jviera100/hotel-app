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
    deletePerfilAndReservasControl,
    getContactoControl,
    postEnviarContactoControl,
    getAdminInicio,
    getPutPerfilModalAdmin,              
    logoutControl
} from '../src/controllers/ApiRestFull.js';
import { verifyToken } from '../middlewares/token.js';

const router = Router();

//rutas (get) son visibles en navegador, rutas (post-put-delete) puedes ver en extensiones Postman o Thunder Client
// cantidad de rutas = cantidad controllers

console.log('routes.js - Iniciando configuración de rutas');

// Ruta por defecto para la página de inicio de cliente y administrador
router.get('/', getHomeControl);

// Rutas para el controlador de inicio y cierre de sesión de cliente y administrador
router.get('/login', getLoginControl);
router.post('/login', postLoginControl); // getUsuarioByEmailQuery
router.get('/logout', logoutControl);

// Ruta para la vista de contacto de cliente y administrador
router.get('/contacto', getContactoControl);
router.post('/contacto', postEnviarContactoControl);

// Rutas para el controlador de agregar usuarios y vista registro de perfil cliente
router.post('/registro', addUsuarioRegistroControl); // addUsuarioQuery
router.get('/registro', getUsuarioRegistroControl);

// Ruta para el controlador de perfil cliente
router.get('/perfil/:email', verifyToken, getPerfilControl); // getUsuarioByEmailQuery
router.put('/perfil/:email', verifyToken, updatePerfilControl); // updateUsuarioByEmailQuery
router.delete('/perfil/:email', verifyToken, deletePerfilAndReservasControl); // deletePerfilAndReservasByEmailQuery

// Ruta para ver las habitaciones y reservar una habitación de perfil cliente 
router.get('/habitaciones/:email', verifyToken, getReservaHabitacionesControl); // getHabitacionesQuery => getReservasQuery => getUsuarioByEmailQuery
router.post('/habitaciones/reserva/:habitacionId', verifyToken, reservarHabitacionControl); // updateDisponibilidadHabitacionQuery
router.post('/habitaciones/eliminar-reserva/:habitacionId', verifyToken, eliminarReservaHabitacionControl); // updateDisponibilidadHabitacionQuery

// Rutas para controladores de administrador
router.get('/admin/inicio/:email', verifyToken, getAdminInicio);// getUsuarioByEmailQuery => getUsuariosQuery => getReservasQuery => getHabitacionesQuery
router.get('/admin/perfil/:email', verifyToken, getPutPerfilModalAdmin);// getUsuarioByEmailQuery

console.log('routes.js - Configuración de rutas completa');

export default router;
