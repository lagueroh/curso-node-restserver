const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

//{{url}}/api/categorias

//Obtener todas las categorias - publico
router.get('/', obtenerProductos);

//obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto);
//Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
    crearProducto
]);
//Actualizar - Privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un ID de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);
//borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    //tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);


module.exports = router;