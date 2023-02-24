const Curso = require('../models/curso');
const Usuario = require('../models/usuario');
//Este archivo maneja validaciones personalizadas

const emailExistente = async (correo = '') => {
    //Verificacion si el correo ya existe en la BD
    const existeEmail = await Usuario.findOne({ correo })

    if (existeEmail) {
        throw new Error(`${correo} ya esta registrado en la BD, ingrese uno nuevo`);
    }
}

const existeUsuarioById = async (id) => {
    //Verificar si el ID existe
    const existeId = await Usuario.findById(id);

    if (!existeId) {
        throw new Error(`El id ${id} no existe en la BD`);
    }
}

const existeCursoById = async (id) => {
    const existeCurso = await Curso.findById(id);

    if (!existeCurso) {
        throw new Error(`El id ${id} no existe en la BD`);
    }
}

const numAlumnosAsig = async (id) => {
    const query = { estudiantes: id, estado: true };
    const asignaciones = await Curso.countDocuments(query);
    return asignaciones;
}

module.exports = {
    emailExistente, existeUsuarioById, existeCursoById, numAlumnosAsig
}