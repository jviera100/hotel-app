//midlewares.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import exphbs from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

export default function setupMiddlewares(app) {
  // Middleware para archivos estáticos
  app.use(express.static(path.join(__dirname, 'assets')));
  app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); // Bootstrap CSS
  app.use(
    fileUpload({
      limits: 5000000, // límite de 5MB
      abortOnLimit: true,
      responseOnLimit: "El tamaño de la imagen supera el límite permitido",
    })
  );
  // Middleware para el análisis de cuerpos JSON
  app.use(bodyParser.json());
  // Middleware de manejo de errores global
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Ha ocurrido un error en el servidor');
  });
  // Configuración de Handlebars
  app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'),
    partialsDir: [
      path.join(__dirname, 'src', 'views', 'partials')
    ],
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
      disponibilidadTexto: function (disponibilidad) {
        return disponibilidad ? "Disponible" : "No disponible";
      },
      tipoHabitacionTexto: function (tipoHabitacionId) {
        switch (tipoHabitacionId) {
          case 1:
            return 'Simple';
          case 2:
            return 'Doble';
          case 3:
            return 'Suite';
          default:
            return 'Desconocido';
        }
      },         
    }
  }));
  app.set('view engine', '.hbs');
  app.set('views', path.join(__dirname, 'src', 'views'));
}
