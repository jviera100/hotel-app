//index.js
import express from "express";
import chalk from "chalk";
import router from "./routes/routes.js";
import setupMiddlewares from './middlewares/middlewares.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security Configurations ---

// 1. Helmet: Secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"], 
        upgradeInsecureRequests: [],
      },
    },
    xFrameOptions: { action: "deny" },
  })
);

// 2. CORS: Restrict cross-origin requests
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// 3. Rate Limiting: Protect against brute-force attacks
import { addCsrfToken } from './middlewares/csrf.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

app.use(limiter);

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(addCsrfToken);
setupMiddlewares(app);

// --- Routes ---
app.use("/", router);

// --- Error Handling ---
app.get('*', (req, res) => {
    res.status(404).render('undefined');
});

app.listen(PORT, () => console.log(chalk.underline.bgCyanBright.magenta.bold.italic(`🔥🔥🔥🔥🔥Servidor conectado en el puerto🔥🔥🔥🔥🔥http://localhost: ${PORT}`)));
