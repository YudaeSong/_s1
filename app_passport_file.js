var bodyParser = require('body-parser');  // POST 값 사용
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');  // 기본으로 메모리에 저장함.
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


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
// app.use(session({
//     store: new FileStore(fileStoreOptions),
//     secret: 'keyboard cat'
// }));

app.use(passport.initialize());
app.use(passport.session());


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
    if(req.user && req.user.displayName){  // 이제 passport 에서 User 정보를 만들어준다.  // 이 User 는 passport.deserializeUser 의 두번째 인자로 넘겨준 User 정보임.
        res.send(`
            <h1> Hello, ${req.user.displayName}</h1>
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
    req.logout();// delete req.session.displayName;  // 세션삭제
    
    req.session.save(function() {    // 세션변경작업이 끝난 후 실행되도록..
        res.redirect('/welcome');
    });
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
        authId: 'local:asdf',
        username : 'asdf',
        password : 'r4MMga2SMvGwSpP/xyGGVRmaYRMtqgM3J+I2WZRL4+vehtoQ8prjV8UCbb3KNkMJuvXXLck5ldsr8QZXD7VIhJ80jsWs+dNwT3xGrAeWnO5ULcaDY5vLp8oJHtVEiGyx6kVSQcUq6m1qd+ItrJqKLWycQ3Odv+sdKP405tCSJzk=',  // '1111'  // 암호가 같지만 salt 값을 다르게 해서 암호화된 값이 달라짐.
        salt:'hNCxMTVcLEGv6W+X4HvJkH3dn2K5ogQlvoArrGZOGFG64gHnnGEShxQM/CaZgthE9wGxvHvde+aqW4b804KCtg==',
        displayName : '하하햐'
    },
    {
        authId: 'local:qwer',
        username : 'qwer',
        password : 'vo/sdvZnwRjmzos4MtcFWV3BjOO7L9EygInxCJEeU+dPUpDRQdMd2Xm4Lf+C9zytEjdwwhcvCk/RiPcLYLrfTs2RA2d1gT4Yl6nyZEqv0HKsR9xN1xmOtl8i3s/qnN6oc+iptd6DMqz1YWUADn1TcrwTWWHTW4D+OOI2753gDv4=',  // '1111'
        salt:'ILEao4aUNLiW+LHXJm5E7aCXcgHifwwa60Iz8jP6tX3jDaD6NFGD4YYqyPz4ytf1a1r3Lxw04lXRY8m+jp+bpA==',
        displayName : '호호호'
    }
];


// 최조 로그인 성공 세션에 저장
passport.serializeUser(function(user, done) {  // 최초 로그인 성공시
    console.log('serializeUser', user);
    done(null, user.authId);  // user의 고유한 아이디를 사용한다. 보통은 사용자 아이디 : user.id  // 이후 passport.deserializeUser 가 실행됨.
});

// 이미 로그인 되었을 경우 세션
passport.deserializeUser(function(id, done) {  // 이미 로그인 되었을 경우에...
    console.log('deserializeUser', id);
    for(var i=0; i<users.length; i++){
        var user = users[i];
        if (user.authId === id) {
            return done(null, user);
        }
    }
    done('There is no user');
    // User.findById(id, function(err, user) {
    //     done(err, user);
    // });
});

// 페스포트중 로컬로그인
passport.use(new LocalStrategy(
  function(username, password, done) {
    var uname = username;
    var pwd = password;

    for(var i=0; i<users.length;i++){
        var user = users[i];
        if(uname === user.username){
            return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
                if (hash === user.password) {  // 로그인 성공
                    console.log('LocalStrategy', user);
                    done(null, user);   // 이때 최초로그인 시  passport.serializeUser 가 실행되고, 이미 로그인 딩어 있다면 passport.deserializeUser 가 실행됨.
                } else {
                    done(null, false);         // 로그인 실패
                }
            });
        }

    }
    done(null, false);  //로그인실패
  }
));

// 페이스북 로그인
passport.use(new FacebookStrategy({
    clientID: '459735781511605', // FACEBOOK_APP_ID,
    clientSecret: '6cfe32991b4743b95bc36eb726135edd', // FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'link', 'about_me', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
      // console.log(profile);
      var authId = 'facebook:' + profile.id;
      for(var i=0; i<users.length;i++){
        var user = users[i];
        if (user.authId === authId) {
            return done(null, user);
        }
      }

      var newuser = {
        'authId' :  authId,
        'dispalyName' : profile.displayName,
        'email' : profile.emails[0].value
      };
      users.push(newuser);
      done(null, newuser);
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));


app.post('/auth/login',
    passport.authenticate(
      'local' 
      , { 
          successRedirect: '/welcome',
          failureRedirect: '/auth/login',
          failureFlash: false 
        }
    )
);

// 타사 인증은 두번을 하고 있으며, 그중 첫번째
app.get('/auth/facebook', 
    passport.authenticate(
        'facebook', { scope: 'email' }
    )
);
// 타사 인증은 두번을 하고 있으며, 그중 두번째
app.get('/auth/facebook/callback',
  passport.authenticate(
    'facebook', 
    { 
          successRedirect: '/welcome',
          failureRedirect: '/auth/login' 
    }
));

// app.post('/auth/login', function (req, res) {

//     //return res.send(users);

//     var uname = req.body.username;
//     var pwd = req.body.password;

//     for(var i=0; i<users.length;i++){
//         var user = users[i];
//         if(uname === user.username){
//             return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
//                 if (hash === user.password) {  // 로그인 성공
//                     req.session.displayName = user.displayName;
//                     return req.session.save(function() {
//                         res.redirect('/welcome');
//                     });
//                 } else {
//                     res.send('Who are you? <a href="/auth/login">login</a>');
//                 }
//             });
//         }

//     }
//     res.send('Who are you? <a href="/auth/login">login</a>');

// });

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
<a href="/auth/facebook">FACEBOOK</a>
`;
    res.send(output);
});

app.post('/auth/register', function (req, res) {
    
    hasher({password:req.body.password}, function(err, pass, salt, hash) {

        var user = {
            authId: 'local:' + req.body.username,
            username : req.body.username,
            password : hash,
            salt : salt,
            displayName : req.body.displayName
        };
        users.push(user);
        req.login(user, function(err) {
            req.session.save(function() {
                res.redirect('/welcome');
            });
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


