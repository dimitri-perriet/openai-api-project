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
        res.redirect('/app');
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
                 req.session.lastname = results[0].lastname;
                 req.session.firstname = results[0].firstname;
                 res.redirect('/app');

             } else {
                 req.flash('info', 'Identifiants incorrects');
                 res.redirect('/');
             }
        });
});

io.on('connection', (socket) => {
});