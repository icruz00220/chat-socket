let params = new URLSearchParams(window.location.search)

if (!params.has('usuario') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El usuario y sala es obligatorio')
}

let usuario = { nombre: params.get('usuario'), sala: params.get('sala') }

function renderizarUsuarios(usuarios) {
    let html = ''
    html += `<li>
        <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
    </li>`

    for (let i = 0; i < usuarios.length; i++) {
        html += ` <li>
        <a data-id="${usuarios[i].id}" href="javascript:void(0)"><img src="assets/images/users/${usuarios[i].imagen}.jpg" alt="user-img" class="img-circle"> <span>${usuarios[i].nombre} <small class="text-success">online</small></span></a>
    </li>`
    }

    $('#divUsuarios').html(html)
    $('#titulo').html(params.get('sala'))
}

function renderizarMensajes(mensaje, local) {
    let html = ''
    let tiempo = new Date(mensaje.tiempo)
    let hora = tiempo.getHours() + ':' + tiempo.getMinutes()

    if (local) {
        html += `<li class="reverse">
        <div class="chat-content">
            <h5>${mensaje.usuario}</h5>
            <div class="box bg-light-inverse">${mensaje.mensaje}</div>
        </div>
        <div class="chat-img"><img src="assets/images/users/${mensaje.imagen}.jpg" alt="user" /></div>
        <div class="chat-time">${hora}</div>
    </li>`
    } else {
        html += '<li>'
        if (mensaje.usuario != 'Administrador')
            html += `<div class="chat-img"><img src="assets/images/users/${mensaje.imagen}.jpg" alt="user" /></div>`
        html += `<div class="chat-content">
            <h5>${mensaje.usuario}</h5>
            <div class="box bg-light-info">${mensaje.mensaje}</div>
        </div>
        <div class="chat-time">${hora}</div>
    </li>`
    }
    $('#divChatbox').append(html)
    scrollBottom()
}

$('#divUsuarios').on('click', 'a', function() {
    let id = $(this).data('id')

    if (id)
        console.log(id);
})

$('#formEnviar').on('submit', (e) => {
    e.preventDefault()
    if ($('#txtMensaje').val().trim().length === 0)
        return

    // Enviar información
    socket.emit('enviarMensaje', {
        usuario: usuario.nombre,
        mensaje: $('#txtMensaje').val()
    }, function(resp) {
        $('#txtMensaje').val('').focus()
        renderizarMensajes(resp, true)
    });

})

function scrollBottom() {

    // selectors
    var newMessage = $('#divChatbox').children('li:last-child');

    // heights
    var clientHeight = $('#divChatbox').prop('clientHeight');
    var scrollTop = $('#divChatbox').prop('scrollTop');
    var scrollHeight = $('#divChatbox').prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        $('#divChatbox').scrollTop(scrollHeight);
    }
}