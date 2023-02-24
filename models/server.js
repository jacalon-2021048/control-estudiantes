//Importaciones de NodeJS
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        //Configuracion inicial Server
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            alumnos: '/api/usuarios/alumnos',
            cursos_alumno: '/api/alumnos/cursos',
            cursos_maestro: '/api/maestros/cursos',
            maestros: '/api/usuarios/maestros'
        }
        //Conexion a la Base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de los servicios
        this.routes();
    }

    //Funcion para establecer la conexion a la bd
    async conectarDB() {
        await dbConnection();
    }

    //Funciones a ejecutar antes de definir las rutas
    middlewares() {
        //Cors
        this.app.use(cors());

        //Lectura y parseo del body para pruebas con archivos JSON
        this.app.use(express.json());

        //Directorio 1
        this.app.use(express.static('public'));
    }

    //Rutas de la pagina
    routes() {
        //Busqueda del archivo que contiene las rutas
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.alumnos, require('../routes/alumno'));
        this.app.use(this.paths.cursos_alumno, require('../routes/curso-alumno'));
        this.app.use(this.paths.cursos_maestro, require('../routes/curso-maestro'));
        this.app.use(this.paths.maestros, require('../routes/maestro'));
    }

    //Listener para el puerto
    listen() {
        //Impresion en consola del puerto en el que se ejecuta el Server
        this.app.listen(this.port, () => {
            console.log('Servidor ejecutandose en el puerto: ', this.port);
        });
    }
}

module.exports = Server;