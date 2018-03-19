// Variable(s)
var ctrl = '../controller/';

// Importation
var express = require('express');

// Création du router
var router = express.Router();

// Configuration du router
router.route('/sign-up').
	post(require(ctrl + 'inscriptionController').index);

router.route('/login').
	post(require(ctrl + 'connexionController').index);

router.route('/user/:id/avatar').
	put(require(ctrl + 'profilController').index);

// Exportation
exports.router = router;