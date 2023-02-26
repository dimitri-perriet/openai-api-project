var express = require('express');
const mysql = require("mysql2");
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    if (req.session.character) {
        const initial = req.session.lastname.charAt(0) + req.session.firstname.charAt(0);

        // console.log(req.session.character)

        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 8889,
            user: 'root',
            password: 'root',
            database: 'openai'
        });

        const character_info = await new Promise((resolve) => {
            connection.query(`SELECT game_character.name AS character_name, games.name AS game_name, details
                              FROM game_character
                                       INNER JOIN games ON game_character.game_id = games.ID
                              WHERE game_character.ID = '${req.session.character}'`,
                function (err, results, fields) {
                    resolve(results);
                });
        });

        //console.log(character_info);

        res.render('app', {
            initial: initial,
            character_id: req.session.character,
            character_name: character_info[0].character_name,
            game_name: character_info[0].game_name
        });
    } else {
        res.redirect('/games');
    }
});

module.exports = router;
