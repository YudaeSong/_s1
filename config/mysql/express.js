
module.exports = function(){
    var express = require('express');
    var session = require('express-session');  // 기본으로 메모리에 저장함.
    var MySQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');  // POST 값 사용
    
    var app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
        secret: 'asdfasdf22314',
        resave: false,
        saveUninitialized: true,
        store:  new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'tkswlrl',
            database: 'o2'
        })
    //    cookie: { secure: true }
    }));
    app.set('view engine', 'pug');   // 템플릿 엔진 설정
    app.set('views', './views/mysql');     // 탬플릿이 보관되는 경로
    
    return app;
}