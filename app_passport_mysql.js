
var app = require('./config/mysql/express')(); 

// 인증은 라우트 위에서 실행해야 됨.
var passport = require('./config/mysql/passport')(app);

app.get('/', function (req, res) {
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


// 라우트 처리
var auth = require('./routes/mysql/auth')(passport);
app.use ('/auth/', auth);                       // /auth/ 로 접근하는 모든 페이지를 auth 라우트로 연결하라

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
