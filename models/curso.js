const { Schema, model } = require('mongoose');

const CursoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    profesor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estudiantes: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    estado: {
        type: Boolean,
        default: true
    }
});
//Que lenguaje se usa para desarrollo web, js, java, php, respuesta correcta todos los anteriores
module.exports = model('Curso', CursoSchema);