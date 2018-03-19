/**
* Fonction retournant l'extension d'un fichier
*
* @param {String} name - nom du fichier
*/
function getExtension (name) {
	var index = name.lastIndexOf('.') + 1;
	var extension = name.substring(index);
	return extension.toLowerCase();
}


/**
* Contrôleur s'occupant du profil d'un urilisateur
*
* @param {Object} req - requête client
* @param {Object} resp - réponse serveur
*/
exports.index = function (req, resp) {
	var ctrl = require('./userController');
	var pathModule = require('path');  
	var formidable = require('formidable');
	var form = new formidable.IncomingForm();
	
	form.parse(req, function(err, fields, files) {
		// ERROR
		if (err) throw  err
		
		var file = files.image;
		var info = {
			extension 	: getExtension(file.name),
			path 		: file.path,
			width 		: -1,
			height  	: -1,
			size 		: file.size
		};


		var msgError = ctrl.checkImage(info);

		// ERROR
		if (msgError != '')
		{
			// Envoi des données au client
			resp.status(400)
				.json({
					error: true,
					msgError: msgError,
					avatar: {}
				});
		}

		else {
			var newName = req.params.id + '.' + info.extension;
			var newPath = pathModule.dirname(__dirname) + '/public/img/avatar/' + newName;
			var avatarClass = (info.height < info.width)?'mini-avatar-height':'mini-avatar-width';

			var userModule = require('../modele/user'); 	// Chargement modèle
			// Traitements de l'avatar
			userModule.setAvatar(req.params.id, newName, info.path, newPath, avatarClass); 	

			// deleteAvatar(req.params.id);		// On supprime l'ancien fichier
			// fs.renameSync(info.path, newPath); 	// On déplace le fichier

			// Envoi des données au client
			resp.status(200)
				.json({
					error: false,
					msgError: msgError,
					avatar: {
						name: newName,
						class: avatarClass
					}
				});
		}
    });
}