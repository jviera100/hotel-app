// <!-- db.js -->
import pg from 'pg';
const { Pool } = pg;
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

// Cargamos las variables de entorno
const { DB_HOST, DB_DATABASE, DB_PORT, DB_USER, DB_PASSWORD, PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Configuración para la base de datos local y remota
const config = {
    local: {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    remote: {
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        port: process.env.DB_PORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        ssl: {
            rejectUnauthorized: false
        }
    }
};

// Función para obtener la configuración según el entorno (local o remoto)
const getConfig = () => {
    if (process.env.NODE_ENV === 'production') {
        console.log('Using remote database configuration');
        return config.remote;
    } else {
        console.log('Using local database configuration');
        return config.local;
    }
};

// Creamos el pool de conexiones utilizando la configuración correspondiente
const pool = new Pool(getConfig());

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectarse a la base de datos:', err.stack);
    }
    console.log(chalk.underline.bgCyanBright.magenta.bold.italic('\n🔥🔥🔥🔥🔥Conexión con la base de datos establecida.🔥🔥🔥🔥🔥'));
    release();
});



export default pool;