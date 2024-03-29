

const {Schema, model} = require('mongoose')

const ProductoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    opcion:{
        type: String,
        required: [true, 'La opcion es obligatorio'],
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type:Number,
        default: 0
    },
    // categoria: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Categoria',
    //     required: true
    // },
    categoria:{
        type: String,
        default: ""
    },
    ano: {
        type: String
    },
    mes: {
        type: String,
    },
    dia: {
        type: String,
    },
    usuarioCargado: {
        type: String,
    }

});

ProductoSchema.methods.toJSON = function () {
    const {__v, estado, ...data} = this.toObject();
    
    return data;
}   

module.exports = model('Producto', ProductoSchema);