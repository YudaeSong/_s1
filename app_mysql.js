

var app = require('./config/mysql/express')(); // 여기에서 세션을 관리해서

// 인증은 라우트 위에서 실행해야 됨.
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use ('/auth/', auth);                       // /auth/ 로 접근하는 모든 페이지를 auth 라우트로 연결하라


var topic = require('./routes/mysql/topic')(); // 모듈을 함수로 만들었기 때문에 () 로 호출해야 함
app.use('/topic', topic);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


