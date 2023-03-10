import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export const emailRegistro = async (datos) => {
    const {email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS
        }
      });

      //Info del mail

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Confirma tu Cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `<p>Hola: ${nombre}! Confirma tu cuenta en UpTask</p>
        <p>Tu cuenta ya está casi lista, solo debes confirmarla mediante el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
        
        
        `
    })

}

export const emailOlvidePassword = async (datos) => {
  const {email, nombre, token} = datos;

  const transport = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    });

    //Info del mail

  const info = await transport.sendMail({
      from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
      to: email,
      subject: "UpTask - Reestablece tu Password",
      text: "Reestablece tu Password",
      html: `<p>Hola: ${nombre}! Has solicitado reestablecer tu password</p>
      <p>Sigue el siguiente enlace para generar un nuevo password:</p>
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
      <p>Si tu no solicitaste esta email, puedes ignorar el mensaje.</p>
      
      
      `
  })

}