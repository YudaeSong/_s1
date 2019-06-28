var bodyParser = require('body-parser');  // POST 값 사용
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');  // 기본으로 메모리에 저장함.

var MySQLStore = require('express-mysql-session')(session);

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'asdfasdf22314',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'tkswlrl',
        database: 'o2'
    })
//    cookie: { secure: true }
}));

app.use(cookieParser('asdfasdf22314'));
var fs = require('fs');

app.use(express.static('public'));
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
app.get('/', function (req, res) {
});

app.get('/count', function (req, res) {
    if (req.session.count){
        req.session.count++;
    }else  {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);  
});

app.get('/welcome', function (req, res) {
    if(req.session.displayName){  // 로그인성공
        res.send(`
            <h1> Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">logout</a>
        `);
    }else {
        res.send(`
            <h1> Welcome </h1>
            <a href="/auth/login">login</a>
        `);
    }

});

app.get('/auth/logout', function (req, res) {
    delete req.session.displayName;  // 세션삭제
    req.session.save(function() {
        res.redirect('/welcome');
    });
});


app.post('/auth/login', function (req, res) {
    var user = {
        username : 'asdf',
        password : '1111',
        displayName : '하하햐'
    }

    var uname = req.body.username;
    var pwd = req.body.password;

    if (uname === user.username && pwd === user.password){
        req.session.displayName = user.displayName;
        req.session.save(function() {
            res.redirect('/welcome');
        });        
    } else {
        res.send('Who are you? <a href="/auth/login">login</a>');
    }
});

app.get('/auth/login', function (req, res) {
    var output = `
    <h1>Login</h1>
<form action='/auth/login' method='post'>
    <p>
        <input type='text' name='username' placeholder='username'>
    </p>
    <p>
        <input type='password' name='password' placeholder='password'>
    </p>
    <p>
        <input type='submit'>
    </p>
</form>
`;
    res.send(output);
});

