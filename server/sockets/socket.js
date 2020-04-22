const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios')

let usuarios = new Usuarios()

io.on('connection', (client) => {

    client.on('iniciarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            callback({
                error: true,
                mensaje: 'El nombre y sala son necesarios'
            })
        }

        client.join(data.sala)

        usuarios.agregarPersonas(client.id, data.nombre, data.sala)

        let personas = usuarios.getPersonaSala(data.sala)

        callback(personas)
        client.broadcast.to(data.sala).emit('PersonaOut', enviarMensaje('Administrador', `${data.nombre} se unio al chat`, data.mensaje))
        client.broadcast.to(data.sala).emit('listado', personas)
    })



    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id)
        client.broadcast.to(persona.sala).emit('enviarMensaje', enviarMensaje(persona.nombre, data.mensaje, persona.imagen));

        callback(enviarMensaje(persona.nombre, data.mensaje, persona.imagen))
    });

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id)
        let mensaje = enviarMensaje(persona.nombre, data.mensaje, persona.imagen)
        client.broadcast.to(data.destino).emit('enviarMensaje', mensaje)
    })

    client.on('disconnect', () => {
        let persOut = usuarios.borrarPersona(client.id)
        client.broadcast.to(persOut.sala).emit('PersonaOut', enviarMensaje('Administrador', `${persOut.nombre} salio del chat`, persOut.imagen))
        client.broadcast.to(persOut.sala).emit('listado', usuarios.getPersonaSala(persOut.sala))
    });
});

function enviarMensaje(usuario, mensaje, imagen) {
    return {
        usuario,
        mensaje,
        tiempo: new Date().getTime(),
        imagen
    }
}