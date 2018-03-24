/**
* Obtenir l'id d'un message
*
* @param {int} emitter_id 
* @param {int} receiver_id 
* @param {int} date 
* @param {Object} eventEmitter 
*/
var getMsgId = function (emitter_id, receiver_id, date, eventEmitter) {
	var id = 0;
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'SELECT id FROM discussions'
		+ ' WHERE emitter_id = ? AND receiver_id = ? AND date = ?';

	// Exécution
	sqlDB.query(sql, [emitter_id, receiver_id, date], function (err, rows) {
		if (err)
			console.log('getMsgId: '  + err.message);

		if (rows.length)	
			id =  rows[0].id;

		sqlDB.end(function (err) {
			if (err)
				console.log('getMsgId: ' + err.message);
		})

		// EventEmitter
		eventEmitter.emit('getMsgId', id);
	});
}


/**
* Ajoute un nouveau message dans la BDD
*
* @param {int} emitter_id 
* @param {int} receiver_id 
* @param {int} message 
* @param {int} date 
* @param {int} status 
* @param {Object} eventEmitter 
*/
var add = function (emitter_id, receiver_id, message, date, status, eventEmitter) {
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'INSERT INTO discussions(emitter_id, receiver_id, message, date, status)'
		+ ' VALUES(?, ?, ?, ?, ?)';

	// Exécution
	sqlDB.query(sql, [emitter_id, receiver_id, message, date, status], function (err) {
		if (err) 
			console.log('add-message: ' + err.message);

		getMsgId(emitter_id, receiver_id, date, eventEmitter);
		
		sqlDB.end(function (err) {
			if (err)
				console.log('add-message: ' + err.message);
		})
	});
}

/**
* Récupère tous les derniers messages reçus par userId 
*
* @param {int} id - l'identifiant de l'utilisateur
* @param {int} chaine - l'identifiant du contact
* @param {Object} eventEmitter 
*/
var getLastMessages = function (id, chaine, eventEmitter) {
	var data = [];
	
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();

	// Requête SQL
	var sql ='SELECT D.*, '
		+ 'U1.name AS nameE, U1.avatarName AS avatarNameE, U1.avatarClass AS avatarClassE, '
		+ 'U2.name AS nameR, U2.avatarName AS avatarNameR, U2.avatarClass AS avatarClassR '
		+ 'FROM discussions D ' 
		+ 'JOIN users U1 ' 
		+ 'ON U1.id = D.emitter_id ' 
		+ 'JOIN USERS U2 ' 
		+ 'ON U2.id = D.receiver_id ' 
		+ 'WHERE (D.emitter_id = ? AND U2.name LIKE ?) OR ' 
		+ '(D.receiver_id = ? AND U1.name LIKE ?) ' 

	// Exécution
	sqlDB.query(sql, [id, chaine + '%', id, chaine + '%'], function (err, rows) {
		if (err)
			console.log('getLastMessages: ' + err.message);

		rows.forEach(function (elm, index) {
			var incr = (elm.status)?0:1;
			var tmp = {};
			tmp.message = {
				emitter_id: elm.emitter_id,
				receiver_id: elm.receiver_id,
				message: elm.message,
				date: elm.date
			};

			if (tmp.message.emitter_id == id) {
				tmp.contact = {
					id: tmp.message.receiver_id,
					name: elm.nameR,
					avatarName: elm.avatarNameR,
					avatarClass: elm.avatarClassR
				};

				if (!data[tmp.message.receiver_id]) {
					tmp.nbrMsgNonLu = 0;
					data[tmp.message.receiver_id] = tmp;
				}

				else {
					tmp.nbrMsgNonLu = data[tmp.message.receiver_id].nbrMsgNonLu;
					data[tmp.message.receiver_id] = tmp;
				}
			}

			else {
				tmp.contact = {
					id: tmp.message.emitter_id,
					name: elm.nameE,
					avatarName: elm.avatarNameE,
					avatarClass: elm.avatarClassE
				};

				if (!data[tmp.message.emitter_id]) {
					tmp.nbrMsgNonLu = incr;
					data[tmp.message.emitter_id] = tmp;
				}

				else {
					tmp.nbrMsgNonLu = data[tmp.message.emitter_id].nbrMsgNonLu + incr;
					data[tmp.message.emitter_id] = tmp;
				}
			}
		})

		// On envoie les résultats
		eventEmitter.emit('getLastMessages', data) 

		sqlDB.end(function (err) {
			if (err)
				console.log('getLastMessages: ' + err.message);
		})
	});
}

/**
* Récupère tous les messages échangés entre userId et contactId
*
* @param {int} userId - l'identifiant de l'utilisateur
* @param {int} contactId - l'identifiant du contact
* @param {Object} eventEmitter 
*/
var getAllMessages = function (userId, contactId, eventEmitter) {
	var data = [];
	
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();

	// Requête SQL
	var sql = 'SELECT * FROM discussions ' 
		+ 'WHERE (emitter_id = ? AND receiver_id = ?) ' 
		+ 'OR (receiver_id = ? AND emitter_id = ?)' 
		+ 'ORDER BY date'

	// Exécution
	sqlDB.query(sql, [userId, contactId, userId, contactId], function (err, rows) {
		if (err)
			console.log('getAllMessages: ' + err.message);

		rows.forEach(function (elm, index) {
			var tmp = {
				id: elm.id,
				emitter_id: elm.emitter_id,
				receiver_id: elm.receiver_id,
				message: elm.message,
				date: elm.date,
				status: elm.status
			};
			data.push(tmp);
		})

		// On envoie les résultats
		eventEmitter.emit('getAllMessages', data) 

		sqlDB.end(function (err) {
			if (err)
				console.log('getAllMessages: ' + err.message);
		})
	});
}

/**
* Met à jour le statut d'un message
*
* @param {int} messageId - l'identifiant du message
* @param {Object} eventEmitter 
*/
var updateStatus = function (messageId) {
	// Connexion à la BDD 
	var sqlDB = require('../modele/dataBase').newConnexion();
	
	// Requête SQL
	var sql = 'UPDATE discussions'
			+ ' SET status = 1'
			+ ' WHERE id = ?';

	// Exécution
	sqlDB.query(sql, [messageId], function (err) {
		if (err)
			console.log('updateStatus: ' + err.message);

		sqlDB.end(function (err) {
			if (err)
				console.log('updateStatus: ' + err.message);
		})
	});
}

// Exports 
exports.getMsgId = getMsgId;
exports.add = add;
exports.getLastMessages = getLastMessages;
exports.getAllMessages = getAllMessages;
exports.updateStatus = updateStatus;