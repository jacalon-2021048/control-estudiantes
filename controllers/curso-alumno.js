//Desestructuracion de los objetos
const { response, request } = require('express');
//Importacion del modelo
const Curso = require('../models/curso');
//Importacion validacion
const { numAlumnosAsig } = require('../helpers/db-validators');

const getCursos = async (req = request, res = response) => {
    //Condiciones del get devuelve todos los cursos con el id del estudiante y estado true
    const query = { estudiantes: req.usuario._id, estado: true };

    //Promesa para obtener los registros
    const listaCursos = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query).populate('profesor','nombre').populate('estudiantes', 'nombre')
    ]);

    //Impresion de registros
    res.status(201).json(listaCursos);
};

const putCurso = async (req = request, res = response) => {
    //Desestructuracion objeto
    const { id } = req.params;
    //Variable para buscar si el curso si ya existe
    const cursoDB = await Curso.findById(id);
    const idUsuario = req.usuario._id.toString();
    if (!cursoDB.estudiantes.includes(idUsuario)) {
        const numeroAsign = await numAlumnosAsig(idUsuario);
        if (numeroAsign < 3) {
            //Generar data a ingresar en el arreglo
            const data = { _id: req.usuario._id };
            cursoDB.estudiantes.push(data);
            await cursoDB.save();
            res.status(201).json(cursoDB);
        }else{
            res.status(401).json('No se puede asignar a mas de 3 cursos');
        }
    } else {
        res.status(401).json('No se puede asignar a un curso que ya esta asignado');

    }

}

module.exports = {
    getCursos, putCurso
};