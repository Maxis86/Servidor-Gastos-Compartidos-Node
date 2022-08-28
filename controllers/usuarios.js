const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const usuariosGet = async (req, res) => {
  //const {q, nombre, apikey} = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  //crear la instancia
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Emcriptar la contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  //Generar el JWT
  const token = await generarJWT(usuario.id);

  //grabar el registro
  await usuario.save();

  res.json({
    msg: "post Api - Controlador",
    usuario,
    token
  });
};

const usuariosPut = async (req, res) => {
  const { id } = req.params;
  //Excluyo los datos que no quiero actualizar
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if (password) {
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    msg: "put Api - Controlador",
    usuario
  });
};

const usuariosDelete = async (req, res) => {
  const { id } = req.params;
  
  const usuario = await Usuario.findByIdAndUpdate(id, {estado:false})
  const usuarioAutenticado = req.usuario;

  res.json( {
    usuario,
    usuarioAutenticado
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
};
