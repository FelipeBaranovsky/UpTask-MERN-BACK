import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { agregarTarea, obtenerTarea, actualizarTarea, eliminarTarea, cambiarEstado, } from "../controllers/tareaController.js";

const router = express.Router();

router.post('/', checkAuth, agregarTarea); //Agregar una tarea a un proyecto
router.route('/:id').get(checkAuth, obtenerTarea).put(checkAuth, actualizarTarea).delete(checkAuth, eliminarTarea);  //Obtener, editar o eliminar una tarea
router.post('/estado/:id', checkAuth, cambiarEstado);  //Cambiar el estado de la tarea

export default router;