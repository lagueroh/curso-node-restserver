
const Role = require('../models/role');
const Usuario = require('../models/usuario');

//valida que existe el rol en la BD
const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}
//Verifica si existe el correo
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} se encuentra registrado`);
    }
}
//verifica la existencia del id de usuario
const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El ID no existe ${id}`);
    }
}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}