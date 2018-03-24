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

router.route('/chat/:userId/contact/:chaine').
	get(require(ctrl + 'contactController').getList);

router.route('/chat/:userId/discussion/:chaine').
	get(require(ctrl + 'discussionController').getLastMessages);

router.route('/discussion/:userId/message').
	post(require(ctrl + 'discussionController').add);

router.route('/discussion/:userId/all-messages/:contactId').
	get(require(ctrl + 'discussionController').getAllMessages);

router.route('/discussion/:userId/message/:messageId/update-status').
	put(require(ctrl + 'discussionController').updateStatus);

// Exportation
exports.router = router;