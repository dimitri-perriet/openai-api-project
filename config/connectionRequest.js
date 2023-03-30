import config from './config.js'
import mysql from 'mysql2'
function connectionRequest() {




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
        }
    });

    return connection
}

export default connectionRequest