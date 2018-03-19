// Constante(s)
JWT_SECRET = '9qacP6B7af3d2nmj3ZHKAYMc59vD2yHrTK2MwS468996aHWfv2';

// Variable(s)
var port = 6060;

// Importation
var express = require('express');
var router = require('./config/myRouter').router;
var cors = require('cors');
var bodyParser = require("body-parser"); 

// Création du serveur
var app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json());

// Routage
app.use('/api/v0/', router);

// Route par défaut
app.use(function (req, resp) {
	resp.status(404).
		json({	error: true,
				msg: 'page not found'
	});
})

// Lancement du serveur
app.listen(port);