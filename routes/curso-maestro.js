//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getCursos, postCurso, putCurso, deleteCurso } = require('../controllers/curso-maestro');
const { existeCursoById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', [
    validarJWT
], getCursos);
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre del curso es obligatorio').not().isEmpty(),
    tieneRole('ROLE_MAESTRO'),
    validarCampos
], postCurso);
router.put('/modificar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCursoById),
    tieneRole('ROLE_MAESTRO'),
    validarCampos
], putCurso);
router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCursoById),
    tieneRole('ROLE_MAESTRO'),
    validarCampos
], deleteCurso);

module.exports = router;