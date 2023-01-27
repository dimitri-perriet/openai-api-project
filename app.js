const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mysql = require('mysql2');
const { Server } = require("socket.io");
const io = new Server(server);
const flash = require('express-flash');
const { Configuration, OpenAIApi } = require("openai");


app.use(express.static('views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use('/css', express.static('node_modules/bootstrap/dist/css'))
app.use('/js', express.static('node_modules/bootstrap/dist/js'))

app.use(flash());

const sessionMiddleware = session({
    secret: "test",
    resave: false,
    saveUninitialized: false
});

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

app.use(sessionMiddleware);

app.get('/', function(req, res){
    if (req.session.loggedin) {
        res.redirect('/games');
    }
    else {
        res.render(__dirname + '/views/login_page.ejs');
    }
});

app.get('/app', function(req, res){
    if (req.session.loggedin) {
        const initial = req.session.lastname.charAt(0) + req.session.firstname.charAt(0);
        res.render(__dirname + '/views/app.ejs', {initial: initial});
    } else {
        res.redirect('/');
    }
});
app.get('/games', async function (req, res) {
    if (req.session.loggedin) {
        const user_id = req.session.user_id;
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
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
                              INNER JOIN games ON game_character.game = games.ID
                              WHERE games.user_id = '${user_id}'`,
                function (err, results, fields) {
                    resolve(results);
                });
        });

        connection.end();

        res.render(__dirname + '/views/games.ejs', {games: games_result, characters: characters_result});
    } else {
        res.redirect('/');
    }
});

server.listen(3000, function() {
    console.log('Server started on port 3000');
});


app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'openai'
    });

     connection.query(`SELECT * FROM user WHERE mail = '${email}' AND password = '${password}'`,
         function(err, results, fields) {
                console.log(results);
             if (results.length > 0) {
                 req.session.loggedin = true;
                 req.session.user_id = results[0].ID;
                 req.session.lastname = results[0].lastname;
                 req.session.firstname = results[0].firstname;
                 res.redirect('/games');

             } else {
                 req.flash('info', 'Identifiants incorrects');
                 res.redirect('/');
             }
        });
});

app.post('/games_options', async (req, res) => {
    if (req.body.game_name) {
        const game = req.body.game_name;
        const user_id = req.session.user_id;

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'openai'
        });

        connection.query(`INSERT INTO games (name, user_id)
                          VALUES ('${game}', '${user_id}')`);

        connection.end();

    }

    if (req.body.character_name) {
        const character = req.body.character_name;
        const character_game = req.body.character_game;

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Donnes moi les détails du personnage sous forme de liste rapide" + character + " du jeux vidéo" + character_game,
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 256
        });

        details = completion.data.choices[0].text.trim();
        // console.log(details);

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'openai'
        });


        connection.query(`INSERT INTO game_character (game, name, details)
                          VALUES ('${character_game}', '${character}', '${details}')`);

        connection.end();


    }
    res.redirect('/games');
});


io.on('connection', (socket) => {
});