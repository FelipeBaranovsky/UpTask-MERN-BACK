import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {obtenerProyectos, obtenerProyecto, nuevoProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador, /*obtenerTareas,*/ buscarColaborador} from '../controllers/proyectoController.js';

const router = express.Router();

router.route('/').get(checkAuth, obtenerProyectos).post(checkAuth, nuevoProyecto);  //Listar todos los proyectos del usuario o Crear un proyecto nuevo
router.route('/:id').get(checkAuth, obtenerProyecto).put(checkAuth, editarProyecto).delete(checkAuth, eliminarProyecto); //Mostrar proyecto o Editar proyecto o Eliminar proyecto
//router.get('/tareas/:id', checkAuth, obtenerTareas);    //Listar las tareas de un proyecto
router.post('/colaboradores', checkAuth, buscarColaborador)
router.post('/colaboradores/:id', checkAuth, agregarColaborador); //Agregar un colaborador al proyecto
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador); //Eliminar un colaborador al proyecto


export default router;