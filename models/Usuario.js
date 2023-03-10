import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
});

//Hashing passwords
/* Se ejecuta como middleware antes de ejecutar cualquier bloque de codigo que implique el 'save' */
usuarioSchema.pre('save', async function(next) {

    if(!this.isModified('password')) {  //Si ya esta hasheado que no lo vuelva a hacer y que pase directamente.
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Comprobar si las contraseñas coinciden
usuarioSchema.methods.comprobarPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;