const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const flash = require('express-flash');
const { Configuration, OpenAIApi } = require("openai");
const bcrypt = require('bcrypt');
const connectionRequest = require('./config/connectionRequest')


var indexRouter = require('./routes/index');
var gamesRouter = require('./routes/games');
var appRouter = require('./routes/chat');
var usersRouter = require('./routes/users');
var gamesControlRouter = require('./routes/gamescontrol');

const path = require("path");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
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

/*app.get('/', function(req, res){
    if (req.session.loggedin) {
        res.redirect('/games');
    }
    else {
        res.render(__dirname + '/views/index.ejs');
    }
});*/

app.use('/', indexRouter);
app.use('/games', gamesRouter);
app.use('/app', appRouter);
app.use('/api/users', usersRouter)
app.use('/api/games', gamesControlRouter);

server.listen(3000, function() {
    console.log('Server started on port 3000');
});


app.use(express.urlencoded({ extended: true }));

/*app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const connection = connectionRequest()


    connection.query(`SELECT password AS hash FROM user WHERE mail = '${email}'`,
        function (err, results, fields) {
            // console.log(results);
            if (bcrypt.compareSync(password, results[0].hash)) {
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
});*/

app.post('/games_options', async (req, res) => {
    if (req.body.game_name) {
        const game = req.body.game_name;
        const user_id = req.session.user_id;

        const connection = connectionRequest()

        connection.query(`INSERT INTO games (name, user_id)
                          VALUES ('${game}', '${user_id}')`);

        connection.end();

        res.redirect('/games');
    }

    if (req.body.character_name) {
        const character = req.body.character_name;
        const character_game = req.body.character_game;

        //TODO : Retrieve game name from ID


        const completion = await openai.createCompletion({
            model: "text-ada-001",
            prompt: "Donnes moi les détails du personnage sous forme de liste rapide et sans caractères spéciaux telles que (')" + character + " du jeux vidéo" + character_game,
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 256
        });

        details = completion.data.choices[0].text.trim();
        // console.log(details);

        const connection = connectionRequest()


        connection.query(`INSERT INTO game_character (game_id, name, details)
                          VALUES ('${character_game}', '${character}', '${details}')`);

        connection.end();

        res.redirect('/games');
    }

    if (req.body.selected_character) {
        req.session.character = req.body.selected_character;
        res.redirect('/app');
    }

});


io.on('connection', (socket) => {
    // console.log(socket.id)
    socket.on('chat message', async (msg, character_id) => {
        console.log(msg, character_id)

        const connection = connectionRequest()

        const character_info = await new Promise((resolve) => {
            connection.query(`SELECT game_character.name AS character_name, games.name AS game_name, details
                              FROM game_character
                              INNER JOIN games ON game_character.game_id = games.ID
                              WHERE game_character.ID = '${character_id}'`,
                function (err, results, fields) {
                    resolve(results);
                });
        });

        console.log("Réponds au texte suivant uniquement du texte en imitant " + character_info[0].character_name + " du jeu " + character_info[0].game_name + " : " + msg);

        const completion = await openai.createCompletion({
            model: "text-ada-001",
            prompt: "Réponds au texte suivant uniquement du texte en imitant " + character_info[0].character_name + " du jeu " + character_info[0].game_name + " : " + msg,
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 256
        });

        details = completion.data.choices[0].text.trim();
        socket.emit('chat receive', details);
    });
});