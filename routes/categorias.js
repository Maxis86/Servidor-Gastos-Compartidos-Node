const { Router } = require("express");
const { check } = require("express-validator");
const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

// {{url}}/api/categorias


//Obtener todas las categorias - público
router.get('/', [
] ,obtenerCategorias)

//Obtener categoría por id - público
router.get('/:id', 
    [
        check("id",'No es un ID válido').isMongoId(),
        check("id").custom(existeCategoria),
        validarCampos
    ]
    ,obtenerCategoria)

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',
[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
]
,crearCategoria)

//Actualizar una categoria por id - privado - cualquier persona con un token valido
router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check("id").custom(existeCategoria),
        validarCampos
    ], 
    actualizarCategoria)

//Borrar una categoría - privado - solo administrador
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check("id",'No es un ID válido').isMongoId(),
    check("id").custom(existeCategoria),
    validarCampos
],borrarCategoria)

module.exports = router;