// middlewares/auth.js

// Middleware para verificar si el usuario autenticado tiene rol de administrador.
// Protege rutas que solo deben ser accesibles por administradores.
export const checkAdmin = (req, res, next) => {
    // req.user se establece en el middleware verifyToken (token.js) después de decodificar el JWT.
    if (req.user && (req.user.tipo_usuario === 'admin' || req.user.tipo_usuario === 'administrator')) {
        next(); // Si es administrador, permite el acceso a la siguiente función en la cadena.
    } else {
        // Si no es administrador, envía una respuesta de acceso prohibido.
        res.status(403).send('Acceso Prohibido: Se requieren permisos de administrador.');
    }
};

// Middleware para verificar si el usuario es el propietario del recurso o un administrador.
// Protege rutas donde un usuario solo debería poder acceder a sus propios datos, o si es admin, a cualquier dato.
export const checkOwnershipOrAdmin = (req, res, next) => {
    // Determina si el usuario es administrador.
    const isAdmin = req.user && (req.user.tipo_usuario === 'admin' || req.user.tipo_usuario === 'administrator');
    // Determina si el usuario es el propietario del recurso (comparando el email del token con el email en los parámetros de la ruta).
    const isOwner = req.user && req.user.email === req.params.email;

    if (isAdmin || isOwner) {
        next(); // Si es administrador o propietario, permite el acceso.
    } else {
        // Si no es ninguna de las dos, envía una respuesta de acceso prohibido.
        res.status(403).send('Acceso Prohibido: No tienes permiso para acceder a este recurso.');
    }
};