const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async(req,res = response) => {
    const {email,name,password}=req.body;

    try {
    //Se va verificar el email que sea unico
    const usuario = await Usuario.findOne({email});
    
    if(usuario){
        return res.status(400).json({
            ok:false,
            msg:'El usuario ya existe con este email'
        });
    }

    //Usuario con el modelo

    const DbUsuario = new Usuario(req.body);


    // Encriptar la contraseña mediante hash
    const salt = bcrypt.genSaltSync();
    DbUsuario.password = bcrypt.hashSync(password,salt);

    //Generar JWT

    const token = await generarJWT(DbUsuario.id, name);

    //Crear usuario en base de datos

    await DbUsuario.save();


    //Generar respuesta

    return res.status(201).json({
        ok:true,
        uid: DbUsuario.id,
        name,
        email,
        token
    })
        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg: 'Error, hable con el administrador'
        });
    }
   

    
}


const loginUsuario = async(req,res) => {

    const {email, password} = req.body;

    try {

        const DbUsuario = await Usuario.findOne({email});
        if(!DbUsuario){
            return res.status(400).json({
                ok:false,
                msg: 'Credenciales incorrectas'
            });
        } 
       
        //confirmar si las credenciales son correctas
        const validPassword = bcrypt.compareSync(password,DbUsuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Credenciales incorrectas'
            });
        }
        //Generar token

        const token = await generarJWT(DbUsuario.id, DbUsuario.name);
        // Respuesta del servicio
        return res.json({
            ok:true,
            uid: DbUsuario.id,
            name:DbUsuario.name,
            email:DbUsuario.email,
            token

        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error, hable con el administrador'
        });
    }

    
}

const revalidarToken = async(req,res) => {

    const {uid} = req;

    //leer bd y obtener email

    const DbUsuario = await Usuario.findById(uid);



    //Generar token
    const token = await generarJWT(uid, DbUsuario.name);

    return res.json({
        ok:true,
        uid,
        name:DbUsuario.name,
        email:DbUsuario.email,
        token
    });
}


module.exports={
    crearUsuario,
    loginUsuario,
    revalidarToken
}