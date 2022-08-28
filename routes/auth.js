const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn, usuarioAutenticado, usuarioLogeado } = require("../controllers/auth");
const { validarJWT } = require("../middlewares");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/login", [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos
] ,login);

// Obtiene el usuario autenticado
router.get('/',
    validarJWT,
    usuarioAutenticado
);

// Obtiene el usuario autenticado
router.get('/logeado',
    validarJWT,
    usuarioLogeado
);

router.post("/google", [
    check("id_token", "id_Token de google es necesario").not().isEmpty(),
    validarCampos
] , googleSignIn);

module.exports = router;