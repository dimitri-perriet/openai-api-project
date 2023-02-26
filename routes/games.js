var express = require('express');
const mysql = require("mysql2");
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    if (req.session.loggedin) {
        const user_id = req.session.user_id;
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 8889,
            user: 'root',
            password: 'root',
            database: 'openai'
        });

        const games_result = await new Promise((resolve) => {
            connection.query(`SELECT ID, name
                              FROM games
                              WHERE user_id = '${user_id}'`,
                function (err, results, fields) {
                    resolve(results);
                });
        });

        const characters_result = await new Promise((resolve) => {
            connection.query(`SELECT game_character.ID, game_character.name, games.name AS game_name
                              FROM game_character
                                       INNER JOIN games ON game_character.game_id = games.ID
                              WHERE games.user_id = '${user_id}'`,
                function (err, results, fields) {
                    resolve(results);
                });
        });


        connection.end();

        res.render('games', {games: games_result, characters: characters_result});
    } else {
        res.redirect('/');
    }
});

module.exports = router;
