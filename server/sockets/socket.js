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
    })

    // Escuchar el cliente
    client.on('enviarMensaje', (data) => {
        let persona = usuarios.getPersona(client.id)
        client.broadcast.to(persona.sala).emit('enviarMensaje', enviarMensaje(persona.nombre, data.mensaje));
    });

    client.on('mensajePrivado', data => {
        let mensaje = enviarMensaje(usuarios.getPersona(client.id).nombre, data.mensaje)
        client.broadcast.to(data.destino).emit('enviarMensaje', mensaje)
    })

    client.on('disconnect', () => {
        let persOut = usuarios.borrarPersona(client.id)
        client.broadcast.to(persOut.sala).emit('PersonaOut', enviarMensaje('Administrador', `${persOut.nombre} salio del chat`))
        client.broadcast.to(persOut.sala).emit('listado', usuarios.getPersonaSala(persOut.sala))
    });
});

function enviarMensaje(usuario, mensaje) {
    return {
        usuario,
        mensaje,
        tiempo: new Date().getTime()
    }
}