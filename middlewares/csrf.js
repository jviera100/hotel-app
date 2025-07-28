// middlewares/csrf.js
import { randomBytes } from 'crypto';

export const addCsrfToken = (req, res, next) => {
    const csrfToken = randomBytes(16).toString('hex');
    res.cookie('csrf-token', csrfToken, { httpOnly: false }); // Accessible by client-side script
    res.locals.csrfToken = csrfToken;
    next();
};

export const verifyCsrfToken = (req, res, next) => {
    const csrfTokenFromCookie = req.cookies['csrf-token'];
    const csrfTokenFromRequest = req.body._csrf || req.headers['x-csrf-token'];

    if (!csrfTokenFromCookie || !csrfTokenFromRequest || csrfTokenFromCookie !== csrfTokenFromRequest) {
        return res.status(403).send('Invalid CSRF token');
    }

    next();
};
