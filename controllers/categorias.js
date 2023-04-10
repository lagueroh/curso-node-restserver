const { response, request } = require("express");
const { Categoria } = require('../models');


//obtenerCategorias - Paginado - Total - populate

const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };


    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde)) //desde un registro en adelante
            .limit(Number(limite)) //limita la cantidad de registros
    ]);
    res.json({

        total,
        categorias
    });
}

//obtenerCategoria - Populate {}
const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);

}




const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriDB = await Categoria.findOne({ nombre });

    if (categoriDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriDB}, ya existe en la BD`
        });
    }
    //guardar la data a grabar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);


    //guardar en DB

    await categoria.save();

    res.status(201).json(categoria);
}


//actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findOneAndUpdate(id, data, { new: true });

    res.json(categoria);




}

//borrarCategoria - estado:false

const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });


    res.json(categoria);

}



module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}