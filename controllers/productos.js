const { response, request } = require("express");
//const { body } = require("express-validator");
const { Producto } = require('../models');


//obtenerCategorias - Paginado - Total - populate

const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };


    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde)) //desde un registro en adelante
            .limit(Number(limite)) //limita la cantidad de registros
    ]);
    res.json({

        total,
        productos
    });
}

//obtenerCategoria - Populate {}
const obtenerProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);

}




const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${categoriDB}, ya existe en la BD`
        });
    }
    //guardar la data a grabar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);


    //guardar en DB

    await producto.save();

    res.status(201).json(producto);
}


//actualizarCategoria
const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findOneAndUpdate(id, data, { new: true });

    res.json(producto);




}

//borrarCategoria - estado:false

const borrarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });


    res.json(producto);

}



module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}