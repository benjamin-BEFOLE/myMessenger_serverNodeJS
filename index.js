
// Importation
var http = require('http');
var express = require('express');
var io = require('socket.io');
var router = require('./config/myRouter').router;
var cors = require('cors');
var bodyParser = require("body-parser"); 
var events = require('events');

// Création du serveur
var app = express();
var server = http.createServer(app);
var port = 6060;
var sockets = io.listen(server);
var globalEvent = new events.EventEmitter();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false, limit: '3mb' }));
app.use(bodyParser.json());
app.use(function (req, resp, next) {
	req.myGlobalEvent = globalEvent;
	next();
});

// Routage
app.use('/api/v0/', router);

// Route par défaut
app.use(function (req, resp) {
	resp.status(404).
		json({	error: true,
				msg: 'page not found'
	});
})

// Ecouteurs d'événements
globalEvent.on('Notification', function (dataMsg) {
	sockets.emit('messageTo' + dataMsg.receiver_id, dataMsg);
});

// Lancement du serveur
server.listen(port);