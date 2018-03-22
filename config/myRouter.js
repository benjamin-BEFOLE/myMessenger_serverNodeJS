// Variable(s)
var ctrl = '../controller/';

// Importation
var express = require('express');

// Création du router
var router = express.Router();

// Configuration du router
router.route('/sign-up').
	post(require(ctrl + 'inscriptionController').index);

router.route('/login/email/:email/password/:password').
	get(require(ctrl + 'connexionController').index);

router.route('/user/:id/avatar').
	put(require(ctrl + 'profilController').checkAvatar);

router.route('/user/:id/avatar/default').
	put(require(ctrl + 'profilController').setAvatarDefault);

router.route('/user/:id/name/:name').
	put(require(ctrl + 'profilController').checkName);

router.route('/user/:id/email/:email').
	put(require(ctrl + 'profilController').checkEmail);

router.route('/user/:id/password').
	put(require(ctrl + 'profilController').checkNewPassword);

router.route('/chat/:userId/new-contact/:chaine').
	get(require(ctrl + 'newContactController').index);

router.route('/chat/:userId/new-contact').
	post(require(ctrl + 'contactController').add);

// Exportation
exports.router = router;