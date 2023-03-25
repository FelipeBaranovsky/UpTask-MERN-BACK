import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import { formatearFecha } from "../utils/formatearFecha.js";


const agregarTarea = async (req, res) => {
    const {proyecto} = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);
    
    //No existe proyecto
    if(!existeProyecto){
        const error = new Error(`No se pudo encontrar el Proyecto`);
        return res.status(404).json({msg: error.message});
    }

    //No es propietario
    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error(`No tienes los permisos para agregar una tarea`);
        return res.status(403).json({msg: error.message});
    }

    const fechaEntregaTarea = new Date(req.body.fechaEntrega)
    const {fechaEntrega: fechaEntregaProyecto} = existeProyecto
    const fechaActual = new Date()

    if(fechaEntregaTarea.getTime() > fechaEntregaProyecto.getTime()) {
        const error = new Error(`Deberías revisar la fecha de entrega del proyecto`);
        return res.status(404).json({msg: error.message});
    }
    if(fechaEntregaTarea.getTime() < fechaActual.getTime()) {
        const error = new Error(`La fecha de entrega de la tarea no puede ser en el pasado`);
        return res.status(404).json({msg: error.message});
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        existeProyecto.tareas.push(tareaAlmacenada._id);
        await existeProyecto.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }
    

};
const obtenerTarea = async (req, res) => {

    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");


    //No existe tarea
    if(!tarea){
        const error = new Error(`No se pudo encontrar la Tarea`);
        return res.status(404).json({msg: error.message});
    }

    //No es propietario
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error(`Acción no Válida`);
        return res.status(403).json({msg: error.message});
    }

    res.json(tarea);

};
const actualizarTarea = async (req, res) => {

    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");


    //No existe tarea
    if(!tarea){
        const error = new Error(`No se pudo encontrar la Tarea`);
        return res.status(404).json({msg: error.message});
    }

    //No es propietario
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error(`Acción no Válida`);
        return res.status(403).json({msg: error.message});
    }
    //Actualizar campos nuevos
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }

};
const eliminarTarea = async (req, res) => {

    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    //No existe tarea
    if(!tarea){
        const error = new Error(`No se pudo encontrar la Tarea`);
        return res.status(404).json({msg: error.message});
    }

    //No es propietario
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error(`Acción no Válida`);
        return res.status(403).json({msg: error.message});
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto);
        proyecto.tareas.pull(tarea._id)
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);
        res.json({msg: 'Tarea Eliminada Correctamente'});
    } catch (error) {
        console.log(error);
    }



};
const cambiarEstado = async (req, res) => {
    
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    //No existe tarea
    if(!tarea){
        const error = new Error(`No se pudo encontrar la Tarea`);
        return res.status(404).json({msg: error.message});
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())){
        const error = new Error(`Acción no Válida`);
        return res.status(403).json({msg: error.message});
    }
    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id;
    const tareaAlmacenada = await tarea.save();
    //const tareaAlmacenada = await Tarea.findById(id).populate('proyecto').populate('completado');
    
    
    res.json(tareaAlmacenada);
};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}

