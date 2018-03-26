Description
===========
Développer une API REST, avec Node.js,  permettant à ses utilisateurs de s'envoyer des messages en temps réel. Les utilisateurs disposent d'un profil qu'ils peuvent modifier et d'une page d'accueil sur laquelle ils peuvent consulter ou envoyer des messages. Un [interface](https://github.com/benjamin-BEFOLE/myMessenger_angularJS) de cette application a été avec AngularJS.


Installation
============
Installer les différents modules avec la commande :	
```
npm install
```

Base de données
===============
Les informations concernant la base de données sont dans le dossier [BDD](https://github.com/benjamin-BEFOLE/myMessenger_serverNodeJS/BDD). Importer le fichier *BDD.sql* pour installer la base de données.

Dans le fichier *dataBase.js*:
```javascript
	var newConnexion = function () {
		// Importation
		var mysql = require('mysql');

		var sqlDB = mysql.createConnection({
			socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',		// Pour MAMP, ...
			// host: 'MON HOTE',	// Pour autre serveur, décommenter et indiquer l'hôte
			// port: <MON PORT>,	// Pour autre serveur, décommenter et indiquer le port
			user: 'root',
			password: 'root',
			database: 'my_messenger_node_js'
		});

		// Connexion
		sqlDB.connect(function (err) {
			if (err) throw err;
		});

		return sqlDB;
	}

	// Exports
	exports.newConnexion = newConnexion;
```


