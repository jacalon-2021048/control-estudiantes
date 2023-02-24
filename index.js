// Importaciones principales
require('dotenv').config();

//Importacion de los archivos
const Server = require('./models/server')

//Instancia del servidor de arranque
const servidorIniciado = new Server();

//Llamar al metodo listen que levanta al servidor
servidorIniciado.listen();