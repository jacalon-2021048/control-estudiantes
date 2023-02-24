const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Base de datos corriendo');
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar la base de datos');
    }

}

module.exports = {
    dbConnection
}