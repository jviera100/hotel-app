//index.js
import express from "express";
import chalk from "chalk";
import router from "./routes/routes.js";
import setupMiddlewares from './middlewares/middlewares.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();


//console.log('Configuraciones de entorno:', process.env);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Cambia esto a la URL de tu frontend
    credentials: true, // Habilita el envío de cookies
};
app.use(cors(corsOptions));

//middlewares
app.use(express.json());//analiza json
//Flexibilidad en el Parsing de Datos Anidados en Formularios Complejos con express.urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Agrega esta línea para analizar cookies
// Configuración de la carpeta estática y los middlewares
setupMiddlewares(app);
//Routes
app.use("/", router);

// Ruta para respuestas no definidas
app.get('*', (req, res) => {
    res.status(404).render('undefined');
});

app.listen(PORT, () => console.log(chalk.underline.bgCyanBright.magenta.bold.italic(`🔥🔥🔥🔥🔥Servidor conectado en el puerto🔥🔥🔥🔥🔥http://localhost: ${PORT}`)));
