import Usuario from "../models/Usuario.js";
import generarId from "../utils/generarId.js";
import generarJWT from "../utils/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../utils/emails.js";


const registrar = async (req,res) => {
    //Usuarios duplicados
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email});       //Buscar usuario x email
    if(existeUsuario) {
        const error = new Error(`Usuario ya registrado`);
        return res.status(400).json({msg: error.message});
    }

    try {
        const usuario = new Usuario(req.body);  //Creando modelo Usuario
        usuario.token = generarId();    //Generar token
        await usuario.save(); //Guardando Usuario en BD

        //Envío de email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });

        res.json({msg: 'Verifica tu Email para Confirmar tu Cuenta'});

    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req,res) => {
    const {email,password} = req.body;
    //Usuario inexistente
    const existeUsuario = await Usuario.findOne({email});   //Buscar usuario x email
    if(!existeUsuario) {
        const error = new Error(`El Usuario no existe`);
        return res.status(404).json({msg: error.message});
    }
    //Usuario no confirmado
    if(!existeUsuario.confirmado) {
        const error = new Error(`Tu cuenta no ha sido confirmada`);
        return res.status(403).json({msg: error.message});
    }

    //Comprobar contraseña
    if(await existeUsuario.comprobarPassword(password)){
        //Correcta
        res.json({
            _id: existeUsuario._id,
            nombre: existeUsuario.nombre,
            email: existeUsuario.email,
            token: generarJWT(existeUsuario._id),   //Generar JWT con el ID
        })
    }else {
        //Incorrecta
        const error = new Error(`El password es incorrecto`);
        return res.status(402).json({msg: error.message});
    }
}

const confirmar = async (req,res) => {
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token}); //Buscar usuario x token
    
    //Comprobar token
    if(!usuarioConfirmar) {
        const error = new Error(`Token no válido`);
        return res.status(401).json({msg: error.message});
    }

    try {
        usuarioConfirmar.confirmado = true; //Confirmar usuario
        usuarioConfirmar.token = "";    //Eliminar token usado
        await usuarioConfirmar.save();      //Actualizar usuario
        res.json({msg: "Usuario confirmado correctamente"});
    } catch (error) {
        
    }

}

const olvidePassword = async (req, res) => {
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email});   //Buscar usuario x email
    if(!existeUsuario) {
        const error = new Error(`El Usuario no existe`);
        return res.status(404).json({msg: error.message});
    }

    try {
        existeUsuario.token = generarId();  //Genero token para cambio de contraseña
        await existeUsuario.save();

        //Enviar el email
        emailOlvidePassword({
            email: existeUsuario.email,
            nombre: existeUsuario.nombre,
            token: existeUsuario.token
        });

        res.json({msg: 'Hemos enviado un email con las instrucciones'});
    } catch (error) {
       console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const tokenValido = await Usuario.findOne({token}); //Buscar usuario x token

    if(tokenValido) {
        res.json({msg: "Token valido y el usuario existe"});
    }else{
        const error = new Error(`Token no válido`);
        return res.status(401).json({msg: error.message});
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    const usuario = await Usuario.findOne({token}); //Buscar usuario x token

    if(usuario) {
        usuario.password = password;    //Cambio contraseña
        usuario.token = ""; //Elimino token usado
        try {
            usuario.save();
            res.json({msg: "Password modificado correctamente"});
        } catch (error) {
            console.log(error);
        }
    }else{
        const error = new Error(`Token no válido`);
        return res.status(401).json({msg: error.message});
    }
}

const perfil = async (req,res) => {
    const {usuario} = req;
    res.json(usuario);
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
};