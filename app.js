const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mysql = require('mysql2');
const { Server } = require("socket.io");
const io = new Server(server);
const flash = require('express-flash');

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
app.get('/games', function(req, res){
    if (req.session.loggedin) {
        res.render(__dirname + '/views/games.ejs');
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

app.post('/games_options', (req, res) => {
    if (req.body.game_name) {
        const game = req.body.game_name;
        const user_id = req.session.user_id;

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'openai'
        });

        connection.query(`INSERT INTO games (name, user_id) VALUES ('${game}', '${user_id}')`);

        connection.end();

    }
    res.redirect('/games');
});


io.on('connection', (socket) => {
});