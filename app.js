/* inportar configurações do servidor */

var app = require('./config/server');

/* porta de escuta */
var server = app.listen(80, function () {
    console.log('Servidor On');
})

var io = require('socket.io').listen(server);

app.set('io', io);

/*criar conexao por websocket*/
io.on('connection', function (socket) {
    console.log('usuario conectou');

    socket.on('disconnect', function () {
        console.log('usuario off');
    })

    socket.on('msgParaServidor', function (data) {

        socket.emit(
            'msgParaCliente',
            { apelido: data.apelido, mensagem: data.mensagem }
        );

        socket.broadcast.emit(
            'msgParaCliente',
            { apelido: data.apelido, mensagem: data.mensagem }
        );

        if (parseInt(data.apelido_atualizado_nos_clientes) == 0) {

            socket.emit(
                'participantesParaCliente',
                { apelido: data.apelido }
            );

            socket.broadcast.emit(
                'participantesParaCliente',
                { apelido: data.apelido }
            );
        }
    });
});
