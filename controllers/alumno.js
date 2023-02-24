//Desestructuracion de los objetos
const { response, request } = require('express');
//Libreria para encriptacion
const bcrypt = require('bcryptjs');
//Importacion del modelo
const Usuario = require('../models/usuario');

const getAlumnos = async (req = request, res = response) => {
    //Condiciones del get devuelve todos los usuarios con role alumno y estado true
    const query = { rol: "ROLE_ALUMNO", estado: true };

    //Promesa para obtener los registros
    const listaAlumnos = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    //Impresion de registros
    res.status(201).json(listaAlumnos);
};

const postAlumno = async (req = request, res = response) => {
    //Desestructuracion objeto
    const rol = "ROLE_ALUMNO";
    const { nombre, correo, password } = req.body;
    //Datos obligatorios
    const alumnoGuardado = new Usuario({ nombre, correo, password, rol });
    //Encriptar password
    const salt = bcrypt.genSaltSync(10);
    alumnoGuardado.password = bcrypt.hashSync(password, salt);
    //Guardar en base de datos
    await alumnoGuardado.save();

    res.status(201).json(alumnoGuardado);
};

const putAlumno = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Evalua que el id del token sea igual al id a modificar
    //Si es asi lo modifica, si no, no lo modifica
    if (findId(req.usuario._id, id)) {
        //Desestructuracion de los campos a reemplazar
        const { _id, rol, ...resto } = req.body;
        //Si existe la password o viene en el req.body, la encripta
        if (resto.password) {
            //Encriptar password
            const salt = bcrypt.genSaltSync(10);
            resto.password = bcrypt.hashSync(resto.password, salt);
        }
        //Editar usando el id
        const alumnoEditado = await Usuario.findByIdAndUpdate(id, resto, { new: true });
        res.status(201).json(alumnoEditado);
    } else {
        res.status(401).json('No puede modificar a otros usuarios')
    }
};

const deleteAlumno = async (req = request, res = response) => {
    //Desestructuracion del parametro recibido a travez de la URL
    const { id } = req.params;
    //Evalua que el id del token sea igual al id a eliminar
    //Si es asi lo elimina, si no, no lo elimina
    if (findId(req.usuario._id, id)) {
        const alumnoDelete = await Usuario.findByIdAndDelete(id);
        res.status(201).json(alumnoDelete);
    } else {
        res.status(401).json('No puede eliminar a otros usuarios');
    }
};

const findId = (uid, id) => {
    return uid == id;
}

module.exports = {
    getAlumnos, postAlumno, putAlumno, deleteAlumno
};