//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getCursos, putCurso } = require('../controllers/curso-alumno');
const { existeCursoById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', [
    validarJWT
], getCursos);
router.put('/asignar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCursoById),
    tieneRole('ROLE_ALUMNO'),
    validarCampos
], putCurso);

module.exports = router;