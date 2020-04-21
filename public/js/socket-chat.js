let socket = io();

let params = new URLSearchParams(window.location.search)

if (!params.has('usuario') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El usuario y sala es obligatorio')
}

let usuario = { nombre: params.get('usuario'), sala: params.get('sala') }

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('iniciarChat', usuario, (data) => {
        console.log(data);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('enviarMensaje', {
    usuario: usuario.nombre,
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});
*/

socket.on('enviarMensaje', (data) => {
    console.log(data);
});

// Escuchar información
socket.on('PersonaOut', (data) => {
    console.log('Servidor:', data);
});

socket.on('listado', (data) => {
    console.log(data);
});