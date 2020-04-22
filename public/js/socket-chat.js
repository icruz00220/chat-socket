let socket = io();

//let params = new URLSearchParams(window.location.search)
/*
if (!params.has('usuario') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El usuario y sala es obligatorio')
}

let usuario = { nombre: params.get('usuario'), sala: params.get('sala') }
*/
socket.on('connect', function() {
    socket.emit('iniciarChat', usuario, (data) => {
        //console.log(data);
        renderizarUsuarios(data)
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

socket.on('enviarMensaje', (data) => {
    renderizarMensajes(data, false)
});

// Escuchar información
socket.on('PersonaOut', (data) => {
    renderizarMensajes(data, false)
});

socket.on('listado', (data) => {
    renderizarUsuarios(data)
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado:', mensaje);
});