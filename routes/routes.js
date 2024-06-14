// routes.js (HTTP requests)
import { Router } from 'express';
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
import { verifyToken } from '../middlewares/token.js';

const router = Router();

// routes (get) are visible in the browser, routes (post-put-delete) you can see in Postman or Thunder Client extensions
// number of routes = number of controllers

console.log('routes.js - Iniciando configuración de rutas');

// Routes to home page
router.get('/', getHomeControl);

// Routes for login and logout handler
router.get('/login', getLoginControl);
router.post('/login', postLoginControl); // getUserByEmailQuery
router.get('/logout', logoutControl);

// Routes for contact view
router.get('/contacto', getContactControl);
router.post('/contacto', postSendContactControl);

// Routes for users controllers
router.post('/registro', addUserRegistrationControl); // addUserQuery
router.get('/registro', getUserRegistrationControl); // getUserByEmailQuery
router.get('/perfil/:email', verifyToken, getProfileControl); // getUserByEmailQuery
router.put('/perfil/:email', verifyToken, updateUserControl); // updateUserByEmailQuery
router.delete('/perfil/:email', verifyToken, deleteUserAndReservationControl); // deleteUserAndReservationByEmailQuery

// Routes for reservation controllers
router.post('/reserva', verifyToken, addReservationControl); // addReservationQuery 
router.get('/reservation-add', verifyToken, getaddReservationControl);
router.put('/reserva/:id', verifyToken, updateReservationControl); // updateReservationQuery 
router.delete('/reserva/:id', verifyToken, deleteReservationControl); // deleteReservationQuery 

// Routes for rooms controllers
router.post('/room', verifyToken, addRoomControl); // addRoomQuery 
router.get('/room-add', verifyToken, getAddRoomControl);
router.delete('/room/:id', verifyToken, deleteRoomControl); // deleteRoomQuery 

// Routes for client controllers
router.get('/customer/inicio/:email', verifyToken, getCustomerInicio);// getUserByEmailQuery => getUsersQuery => getReservationQuery => getRoomQuery


// Routes for administrator controllers
router.get('/admin/inicio/:email', verifyToken, getAdminInicio);// getUserByEmailQuery => getUsersQuery => getReservationQuery => getRoomQuery
router.get('/admin/perfil/:email', verifyToken, getUpdateUserModalAdmin);// getUserByEmailQuery
router.get('/admin/reserva/:email', verifyToken, getUpdateReservationModalAdmin);// getReservationByEmailQuery => no se usara

console.log('routes.js - Configuración de rutas completa');

export default router;
