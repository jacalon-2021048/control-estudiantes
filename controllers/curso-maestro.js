//Desestructuracion de los objetos
const { response, request } = require('express');
//Importacion del modelo
const Curso = require('../models/curso');

const getCursos = async (req = request, res = response) => {
    //Condiciones del get devuelve todos los cursos con el id gel maestro y estado true
    const query = { profesor: req.usuario._id, estado: true };

    //Promesa para obtener los registros
    const listaCursos = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query).populate('profesor','nombre').populate('estudiantes', 'nombre')
    ]);

    //Impresion de registros
    res.status(201).json(listaCursos);
};

const postCurso = async (req = request, res = response) => {
    //Desestructuracion objeto
    const { nombre } = req.body;
    //Variable para buscar si el curso si ya existe
    const cursoDB = await Curso.findOne({ nombre });
    //Validacion para verificar el curso, para que no sea agregado si no existe
    if (cursoDB) {
        return res.status(400).json(`El curso ${cursoDB.nombre} ya existe`);
    }
    //Generar data a ingresar con el usuario
    const data = {
        nombre,
        profesor: req.usuario._id
    }

    const cursoGuardado = new Curso(data);
    //Guardar en base de datos
    await cursoGuardado.save();

    res.status(201).json(cursoGuardado);
};

const putCurso = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const cursoDB = await Curso.findById(id);
    //Evalua que el id del token sea igual al id del profesor
    //Si es asi lo modifica, si no, no lo modifica
    if (req.usuario._id.toString() == cursoDB.profesor.toString()) {
        //Desestructuracion de los campos a reemplazar
        const { _id, estado, profesor, ...resto } = req.body;
        //Editar usando el id
        const cursoEditado = await Curso.findByIdAndUpdate(id, resto, { new: true });
        res.status(201).json(cursoEditado);
    } else {
        res.status(401).json('No puede modificar los cursos de otro profesor')
    }
};

const deleteCurso = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    const cursoDB = await Curso.findById(id);
    //Evalua que el id del token sea igual al id a eliminar
    //Si es asi lo elimina, si no, no lo elimina
    if (req.usuario._id.toString() == cursoDB.profesor.toString()) {
        const cursoDelete = await Curso.findByIdAndDelete(id);
        res.status(201).json(cursoDelete);
    } else {
        res.status(401).json('No puede eliminar cursos de otros profesores');
    }
};

module.exports = {
    getCursos, postCurso, putCurso, deleteCurso
};