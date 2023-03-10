import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const obtenerProyectos = async (req,res) => {
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario).select("-tareas");
    res.json(proyectos);
}

const obtenerProyecto = async (req,res) => {
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id).populate('tareas');
    
    //No existe proyecto
    if(!proyecto){
        const error = new Error(`No se pudo encontrar el Proyecto`);
        return res.status(404).json({msg: error.message});
    }

    //No es propietario
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error(`Acción no Válida`);
        return res.status(403).json({msg: error.message});
    }

    //const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);

    res.json(proyecto);

}

const nuevoProyecto = async (req,res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }

}

const editarProyecto = async (req,res) => {
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id);
    
    //No existe proyecto
    if(!proyecto){
        const error = new Error(`No se pudo encontrar el Proyecto`);
        return res.status(404).json({msg: error.message});
    }

    //No es propietario
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error(`Acción no Válida`);
        return res.status(403).json({msg: error.message});
    }

    //Actualizar solo lo modificado
    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }

    
}

const eliminarProyecto = async (req,res) => {
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id);
    
    //No existe proyecto
    if(!proyecto){
        const error = new Error(`No se pudo encontrar el Proyecto`);
        return res.status(404).json({msg: error.message});
    }

    //No es propietario
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error(`Acción no Válida`);
        return res.status(403).json({msg: error.message});
    }

    try {
        await proyecto.deleteOne();
        res.json({msg: "Proyecto eliminado"});
    } catch (error) {
        console.log(error);
    }

}

const agregarColaborador = async (req,res) => {
    
}

const eliminarColaborador = async (req,res) => {
    
}

const obtenerTareas = async (req,res) => {
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id);
    
    //No existe proyecto
    if(!proyecto){
        const error = new Error(`No se pudo encontrar el Proyecto`);
        return res.status(404).json({msg: error.message});
    }

    //No es propietario
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error(`Acción no Válida`);
        return res.status(403).json({msg: error.message});
    }

    //Obtener tareas

    const tareas = await Tarea.find().where("proyecto").equals(id);
    res.json(tareas);
}

export {
    obtenerProyectos,
    obtenerProyecto,
    nuevoProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas,
}