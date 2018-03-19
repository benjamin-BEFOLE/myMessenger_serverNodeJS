
var newConnexion = function () {
	// Importation
	var mysql = require('mysql');

	var sqlDB = mysql.createConnection({
		socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',		// Pour MAMP
		// host: 'MON HOTE',	// Pour autre serveur
		// port: <MON PORT>,	// Pour autre serveur
		user: 'root',
		password: 'root',
		database: 'my_messenger_node_js'
	});

	// Connection
	sqlDB.connect(function (err) {
		if (err) throw err;
	});

	return sqlDB;
}

// Exportation
exports.newConnexion = newConnexion;
