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
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});