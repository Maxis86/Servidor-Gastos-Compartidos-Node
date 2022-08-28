const {response} = require ('express');
const {Categoria, Usuario} = require('../models');

// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async (req, res =response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, Categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.json({
        total,
        Categorias
    });

}

// obtenerCategoria - populate {}

const obtenerCategoria = async (req, res =response) => {

    const { id } = req.params;

    const datosCategoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if (!datosCategoria) {
        
            return res.status(400).json({
                msg: `La categoría no existe`
            })
 
    }
    res.json({
        datosCategoria
      });

}

// actualizarCategoria

const actualizarCategoria = async (req, res =response) => {

    const { id } = req.params;
    //Excluyo los datos que no quiero actualizar
    const { estado, usuario, ...data} = req.body;
  
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true})

    // TODO validar contra base de datos
    // if (password) {
    //   const salt = bcryptjs.genSaltSync(10);
    //   resto.password = bcryptjs.hashSync(password, salt);
    // }
  
// const usuario = await Usuario.findByIdAndUpdate(id, nombre);
  
    res.json({
      categoria
    });

}

const borrarCategoria = async (req, res =response) => {

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id,  {estado:false}, {new: true})

    res.json({
        categoriaBorrada
    });

}


// borrarCategoria - estado: false
const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase(); // toUpperCase para que sea todo mayúscula

    const categoriaDB = await Categoria.findOne({nombre})

    if ( categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existee`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    //Prepara la categoria
    const categoria = new Categoria (data);

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}