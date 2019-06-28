var bodyParser = require('body-parser');  // POST 값 사용
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');  // 기본으로 메모리에 저장함.
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

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
            <a href="/auth/register">신규가입</a>
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
// > var bkfd2Password = require("pbkdf2-password");
// var hasher = bkfundefined
// > var hasher = bkfd2Password();
// undefined
// > hasher({password:'1111'}, function(err, pass, salt, hash) {
// ... console.log(err, pass, salt, hash);
// ... });
// undefined
// > null '1111' 'hNCxMTVcLEGv6W+X4HvJkH3dn2K5ogQlvoArrGZOGFG64gHnnGEShxQM/CaZgthE9wGxvHvde+aqW4b804KCt
// g==' 'r4MMga2SMvGwSpP/xyGGVRmaYRMtqgM3J+I2WZRL4+vehtoQ8prjV8UCbb3KNkMJuvXXLck5ldsr8QZXD7VIhJ80jsWs+d
// NwT3xGrAeWnO5ULcaDY5vLp8oJHtVEiGyx6kVSQcUq6m1qd+ItrJqKLWycQ3Odv+sdKP405tCSJzk='
// > hasher({password:'1111'}, function(err, pass, salt, hash) {
// ... console.log(err, pass, salt, hash);
// ... });
// undefined
// > null '1111' 'ILEao4aUNLiW+LHXJm5E7aCXcgHifwwa60Iz8jP6tX3jDaD6NFGD4YYqyPz4ytf1a1r3Lxw04lXRY8m+jp+bp
// A==' 'vo/sdvZnwRjmzos4MtcFWV3BjOO7L9EygInxCJEeU+dPUpDRQdMd2Xm4Lf+C9zytEjdwwhcvCk/RiPcLYLrfTs2RA2d1gT
// 4Yl6nyZEqv0HKsR9xN1xmOtl8i3s/qnN6oc+iptd6DMqz1YWUADn1TcrwTWWHTW4D+OOI2753gDv4='


var users = [
    {
        username : 'asdf',
        password : 'r4MMga2SMvGwSpP/xyGGVRmaYRMtqgM3J+I2WZRL4+vehtoQ8prjV8UCbb3KNkMJuvXXLck5ldsr8QZXD7VIhJ80jsWs+dNwT3xGrAeWnO5ULcaDY5vLp8oJHtVEiGyx6kVSQcUq6m1qd+ItrJqKLWycQ3Odv+sdKP405tCSJzk=',  // '1111'  // 암호가 같지만 salt 값을 다르게 해서 암호화된 값이 달라짐.
        salt:'hNCxMTVcLEGv6W+X4HvJkH3dn2K5ogQlvoArrGZOGFG64gHnnGEShxQM/CaZgthE9wGxvHvde+aqW4b804KCtg==',
        displayName : '하하햐'
    },
    {
        username : 'qwer',
        password : 'vo/sdvZnwRjmzos4MtcFWV3BjOO7L9EygInxCJEeU+dPUpDRQdMd2Xm4Lf+C9zytEjdwwhcvCk/RiPcLYLrfTs2RA2d1gT4Yl6nyZEqv0HKsR9xN1xmOtl8i3s/qnN6oc+iptd6DMqz1YWUADn1TcrwTWWHTW4D+OOI2753gDv4=',  // '1111'
        salt:'ILEao4aUNLiW+LHXJm5E7aCXcgHifwwa60Iz8jP6tX3jDaD6NFGD4YYqyPz4ytf1a1r3Lxw04lXRY8m+jp+bpA==',
        displayName : '호호호'
    }
];
app.post('/auth/login', function (req, res) {

    //return res.send(users);

    var uname = req.body.username;
    var pwd = req.body.password;

    for(var i=0; i<users.length;i++){
        var user = users[i];
        if(uname === user.username){
            return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
                if (hash === user.password) {  // 로그인 성공
                    req.session.displayName = user.displayName;
                    return req.session.save(function() {
                        res.redirect('/welcome');
                    });
                } else {
                    res.send('Who are you? <a href="/auth/login">login</a>');
                }
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
        <input type='submit'><a href="/auth/register">신규가입</a>
    </p>
</form>
`;
    res.send(output);
});

app.post('/auth/register', function (req, res) {
    
    hasher({password:req.body.password}, function(err, pass, salt, hash) {

        var user = {
            username : req.body.username,
            password : hash,
            salt : salt,
            displayName : req.body.displayName
        };
        users.push(user);
        req.session.displayName = req.body.displayName;  // 신규가입후 바로 로그인 처리
        req.session.save(function() {
            res.redirect('/welcome');
        });

    });

});

app.get('/auth/register', function (req, res) {
    var output = `
    <h1>Register</h1>
<form action='/auth/register' method='post'>
    <p>
        <input type='text' name='username' placeholder='username'>
    </p>
    <p>
        <input type='password' name='password' placeholder='password'>
    </p>
    <p>
        <input type='text' name='displayName' placeholder='displayName'>
    </p>
    <p>
        <input type='submit'>
    </p>
</form>
`;
    res.send(output);
});


