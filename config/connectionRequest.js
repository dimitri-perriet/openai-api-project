const config = require('./config');
module.exports = function () {

    let mysql = require('mysql2')


    let connection = mysql.createConnection({
        host: 'localhost',
        port: config.port,
        user: config.db_user,
        password: config.db_pwd,
        database: config.db_name
    });

    connection.connect(function (err) {
        if (err) {
            console.log(`Connexion à la bdd échouée ${err.stack}`)
        } else {
            console.log(`Connexion à la bdd réussi ${connection.threadId}`)
        }
    });

    return connection
}