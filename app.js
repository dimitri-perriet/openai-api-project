const express = require('express');
const app = express();
const mysql = require('mysql2');

app.use(express.static('views'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
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
                 console.log('User found');
             } else {
                 console.log('User not found');
                 res.sendStatus(401);             }
        });
    res.sendFile(__dirname + '/views/index.html');


});