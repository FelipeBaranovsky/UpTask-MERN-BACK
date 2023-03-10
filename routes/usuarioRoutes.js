import express from "express";
import checkAuth from "../middleware/checkAuth.js";
//controllers
import {registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil} from '../controllers/usuarioController.js';

//routing
const router = express.Router();

router.post('/', registrar);    //Crear nuevo usuario
router.post('/login', autenticar);  //Autenticar usuario
router.get('/confirmar/:token', confirmar); //Confirmar usuario
router.post('/olvide-password', olvidePassword); //Cambiar contraseña
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);    //Comprobar token

router.get('/perfil', checkAuth, perfil);

export default router;