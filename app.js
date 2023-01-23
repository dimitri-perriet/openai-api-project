const express = require('express');
const app = express();
const mysql = require('mysql2');

app.use(express.static('views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(require("express-session")({
    secret: "test",
    resave: false,
    saveUninitialized: false
}));

app.get('/', function(req, res){
    if (req.session.loggedin) {
        res.redirect('/app');
    }
    else {
        res.render(__dirname + '/views/login_page.html');
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

app.listen(3000, function() {
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
                 res.sendStatus(401);
             }
        });
});