//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAlumnos, postAlumno, putAlumno, deleteAlumno } = require('../controllers/alumno');
const { emailExistente, existeUsuarioById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getAlumnos);
router.post('/agregar', [
    check('nombre', 'El nombre del usuario es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de mas de 6 digitos').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExistente),
    validarCampos
], postAlumno);
router.put('/modificar/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    tieneRole('ROLE_ALUMNO'),
    validarCampos
], putAlumno);
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ROLE_ALUMNO'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], deleteAlumno);

module.exports = router;