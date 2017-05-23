/**
 * http://nodecode.de/chat-nodejs-websocket
 * den Server zu starten, musst du den Befehl node server.js eingeben.
 * Danach ist die Anwendung über die Adresse http://127.0.0.1:8080/ zu erreichen.
 *
 * Log:
 *  Request URL:ws://127.0.0.1:8080/socket.io/?EIO=3&transport=websocket&sid=JP49prWUQRTigpI7AAAA
 *  Request Method:GET
 *  Status Code:101 Switching Protocols
 *
 */
var express = require('express')
    ,   app = express()
    ,   server = require('http').createServer(app)
    ,   io = require('socket.io').listen(server)
    ,   conf = require('./config.json');

// Webserver
// auf den Port x schalten
server.listen(conf.port);

// app.configure(function(){
//     // statische Dateien ausliefern
//     app.use(express.static(__dirname + '/public'));
// });
app.use(express.static(__dirname + '/public'));
//

// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
    // so wird die Datei index.html ausgegeben
    res.sendfile(__dirname + '/public/index.html');
});

// URKA, fuer android
app.get('/android', function (req, res) {
    // so wird die Datei index.html ausgegeben
    //res.sendfile(__dirname + '/public/index.html');
    res.send("hallo");
});

// URKA: wir merken uns den Client (unique id)
let clientId = 0;

// Websocket
io.sockets.on('connection', function (socket) {
    // der Client ist verbunden
    //clientId++;

    // URKA
    // send the clients id to the client itself.
    //socket.send(socket.id)

    socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden! Deine Client Id ist ' +socket.id });

    // wenn ein Benutzer einen Text senden
    socket.on('chat', function (data) {
        // so wird dieser Text an alle anderen Benutzer gesendet
        io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text + ", sent from client id "+socket.id});
        // URKA: zum caller selbst auch noch etwas senden (zusaetzlich)
        socket.emit('chat', { zeit: new Date(), text: '*** das ist nur fuer dich! streng geheim ****' +socket.id });
    });
});

// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun unter http://127.0.0.1:' + conf.port + '/');