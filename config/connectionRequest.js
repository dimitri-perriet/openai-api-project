module.exports = function () {

    let mysql = require('mysql2')


    let connection = mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'openai'
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