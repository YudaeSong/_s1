var bodyParser = require('body-parser');  // POST 값 사용
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');  // 기본으로 메모리에 저장함.
var sha256 = require('sha256');

var FileStore = require('session-file-store')(session);
var fileStoreOptions = {};

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'asdfasdf22314',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
//    cookie: { secure: true }
}));
app.use(session({
    store: new FileStore(fileStoreOptions),
    secret: 'keyboard cat'
}))


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
    res.redirect('/welcome');
    //res.redirect('/welcome');
    //res.send('hi');
});

// 노드에서 암호화 해서 패스워드르르 변경함.
// $ node
// > var sha256 = require('sha256');
// undefined
// > function enc(pwd, salt) {return sha256(pwd+salt);}
// undefined
// > end('1111','asdf1234');
// Thrown:
// ReferenceError: end is not defined
// > enc('1111','asdf1234');
// 'a8dc59141c3614e25b3bd858fedb2318abeb51b023fbaf13a9967d71066a54b5'
// > enc('1111', 'qwer1234');
// '6bbfd022dafa343dfcbec58ae2d053058083603e1cd3c6707899a75484a6991b'
// >

var users = [
    {
        username : 'asdf',
        password : 'a8dc59141c3614e25b3bd858fedb2318abeb51b023fbaf13a9967d71066a54b5',  // '1111'  // 암호가 같지만 salt 값을 다르게 해서 암호화된 값이 달라짐.
        salt:'asdf1234',
        displayName : '하하햐'
    },
    {
        username : 'qwer',
        password : '6bbfd022dafa343dfcbec58ae2d053058083603e1cd3c6707899a75484a6991b',  // '1111'
        salt:'qwer1234',
        displayName : '호호호'
    }
]
app.post('/auth/login', function (req, res) {

    var uname = req.body.username;
    var pwd = req.body.password;

    for(var i=0; i<users.length;i++){
        var user = users[i];
        if (uname === user.username && sha256(pwd+user.salt) === user.password){
            req.session.displayName = user.displayName;
            return req.session.save(function() {
                res.redirect('/welcome');
            });            
        }
    }
    res.send('Who are you? <a href="/auth/login">login</a>');

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

