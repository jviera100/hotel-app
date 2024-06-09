 // token.js
 import jwt from 'jsonwebtoken';
 import dotenv from 'dotenv';
 
 dotenv.config(); // Cargar variables de entorno desde el archivo .env
 
 const jwtSecret = process.env.SECRET_KEY; // Obtener la clave secreta desde el archivo .env
 
 /// Middleware para verificar el token JWT en las rutas, el token se genero en apirest y se almaceno en cookie previamente
 const verifyToken = (req, res, next) => {
     const token = req.cookies.token; // Recupera el token de la cookie
     console.log('Token recibido:', token);
     if (token) {
         try {
             const decoded = jwt.verify(token, jwtSecret);
             console.log('Token decodificado:', decoded);
             req.user = decoded; // Asigna el token decodificado a req.user
             next();
         } catch (error) {
            console.error('Fallo al verificar el token:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
         }
     } else {
         // res.status(401).json({ message: 'Not authorized, no token' });
         console.log('No se proporcionó token');
         res.redirect('/nooo');
     }
 };
 
 // Middleware para manejar rutas restringidas
 const restrictedRoute = (req, res) => {
     res.status(403).render('access_denied'); // Renderiza la página de acceso restringido
 };
 
 // Exportar middleware y funciones
 export { verifyToken, restrictedRoute };
 