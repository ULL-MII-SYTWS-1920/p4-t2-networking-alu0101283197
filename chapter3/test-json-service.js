'use strict';
const server = require('net').createServer(connection => {
    console.log('Subscriber connected.');

    //Dos mensajes
    const firstChunk = '{"type":changed","timesta';
    const secondChunk = 'mp":1450694370094}​​\​​n';
    //Enviando el primer trozo
    connection.write(firstChunk);

    //Contador => segundo trozo
    const timer = setTimeout(() => {
        connection.write(secondChunk);
        connection.end();
    }, 100);

    //Borrar contador
    connection.on('end', () => {
        clearTimeout(timer);
        console.log('Subscriber disconnected.');
    });
});

server.listen(60300,function(){
    console.log('Test server listening for subscribers...');
});