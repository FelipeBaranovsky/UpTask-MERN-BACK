import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';



const app = express();
app.use(express.json()); //Procesar info como JSON
conectarDB();           //DB connection
dotenv.config();        //Envs

//CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback) {
        if(whitelist.includes(origin)){
            //Puede consultar API
            callback(null,true);
        }else{
            //No puede consultar API
            callback(new Error("Error de Cors"));
        }
    }
};

app.use(cors(corsOptions));


//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);


//Run
const port = process.env.APP_PORT || 4000;
const servidor = app.listen(port, () => {
    console.log('Server listening on port ' + port);
});

//Socket.io
import {Server} from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

io.on('connection', (socket) => {
    //console.log('Socket.io connection established');
    //Eventos de socket.io
    
    socket.on("abrir proyecto", (proyecto) => {
        socket.join(proyecto);
    })

    socket.on('nueva tarea', (tarea) => {
        socket.to(tarea.proyecto).emit('tarea agregada', tarea);
    });

    socket.on('eliminar tarea', (tarea) => {
        socket.to(tarea.proyecto).emit('tarea eliminada', tarea);
    });

    socket.on('editar tarea', (tarea) => {
        socket.to(tarea.proyecto._id).emit('tarea editada', tarea);
    });

    socket.on('cambiar estado', (tarea) => {
        socket.to(tarea.proyecto._id).emit('nuevo estado', tarea);
    });
})