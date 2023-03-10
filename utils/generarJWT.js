import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const generarJWT = (id) => {
    dotenv.config(); 
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",

    });
}

export default generarJWT;