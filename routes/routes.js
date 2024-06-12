// routes.js (solicitudes HTTP)
import { Router } from 'express';
import {
    getHomeControl,
    
    getLoginControl,
    postLoginControl,
    logoutControl,

    getContactoControl,
    postEnviarContactoControl,

    addUsuarioRegistroControl,
    getUsuarioRegistroControl,
    getPerfilControl,
    updatePerfilControl,
    deletePerfilAndReservasControl,

    addReservaControl, 
    getAddReservaControl,   
    getReservasControl,
    getReservaByIdControl,    
    updateReservaControl,
    deleteReservaControl, 
    
    getCustomerInicio,
    
    getAdminInicio,
    getUpdatePerfilModalAdmin    
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
router.get('/registro', getUsuarioRegistroControl); // getUsuarioByEmailQuery

// Ruta para el controlador de perfil cliente
router.get('/perfil/:email', verifyToken, getPerfilControl); // getUsuarioByEmailQuery
router.put('/perfil/:email', verifyToken, updatePerfilControl); // updateUsuarioByEmailQuery
router.delete('/perfil/:email', verifyToken, deletePerfilAndReservasControl); // deletePerfilAndReservasByEmailQuery

// Rutas para gestionar reservas
router.post('/reserva', verifyToken, addReservaControl); // addReservaQuery 
router.get('/reservation-add', verifyToken, getAddReservaControl);
router.get('/reservas', verifyToken, getReservasControl); // getReservasQuery
router.get('/reserva/:id', verifyToken, getReservaByIdControl); // getReservaByIdQuery
router.put('/reserva/:id', verifyToken, updateReservaControl); // updateReservaQuery 
router.delete('/reserva/:id', verifyToken, deleteReservaControl); // deleteReservaQuery 


// Rutas para controladores de cliente
router.get('/customer/inicio/:email', verifyToken, getCustomerInicio);// getUsuarioByEmailQuery => getUsuariosQuery => getReservasQuery => getHabitacionesQuery


// Rutas para controladores de administrador
router.get('/admin/inicio/:email', verifyToken, getAdminInicio);// getUsuarioByEmailQuery => getUsuariosQuery => getReservasQuery => getHabitacionesQuery
router.get('/admin/perfil/:email', verifyToken, getUpdatePerfilModalAdmin);// getUsuarioByEmailQuery

console.log('routes.js - Configuración de rutas completa');

export default router;
