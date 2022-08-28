const { response, json } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/googleVerify");
const { validarJWT } = require("../middlewares");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    //Si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado false",
      });
    }

    //Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const usuarioAutenticado = async (req, res = response) => {
  try {
   
    //const usuario = await Usuario.findOne({ correo });
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    console.log("catch");
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const usuarioLogeado = async (req, res = response) => {

  try {
    res.json( true );
  } catch (error) {
    console.log("usuario no Logeado");
    console.log(error);
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //tengo que crearlo

      const data = {
        nombre,
        correo,
        password: ":p",
        img,
        google: true,
        rol: "USER_ROLE",
      };
      try {
        usuario = new Usuario(data);

        await usuario.save();
      } catch (error) {
        console.log(error);
      }
    } // si se quiere actualizar el usuario va por el else

    // Si el usuario en BD
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usurio borrado",
      });
    }

    //generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
  usuarioAutenticado,
  usuarioLogeado
};
