

module.exports = function(passport){

    var conn = require('../../config/mysql/db')();
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();    
    var route = require('express').Router();

    route.get('/logout', function (req, res) {
        req.logout();// delete req.session.displayName;  // 세션삭제
        
        req.session.save(function() {    // 세션변경작업이 끝난 후 실행되도록..
            res.redirect('/topic');
        });
        //res.redirect('/welcome');
        //res.send('hi');
    });


    route.post('/login',
        passport.authenticate(
        'local' 
        , { 
            successRedirect: '/topic',
            failureRedirect: '/auth/login',
            failureFlash: false 
            }
        )
    );

    // 타사 인증은 두번을 하고 있으며, 그중 첫번째
    route.get('/facebook', 
        passport.authenticate(
            'facebook', { scope: 'email' }
        )
    );
    // 타사 인증은 두번을 하고 있으며, 그중 두번째
    route.get('/facebook/callback',
    passport.authenticate(
        'facebook', 
        { 
            successRedirect: '/topic',
            failureRedirect: '/auth/login' 
        }
    ));

    route.get('/login', function (req, res) {
        res.render('auth/login');
    });

    route.post('/register', function (req, res) {
        
        hasher({password:req.body.password}, function(err, pass, salt, hash) {

            var user = {
                authId: 'local:' + req.body.username,
                username : req.body.username,
                password : hash,
                salt : salt,
                displayName : req.body.displayName,
                email : ''
            };
            
            var sql = 'insert into users set ?';
            conn.query(sql, user, function(err, results) {
                if (err){
                    console.log(err);
                    res.status(500);
                } else {
                    req.login(user, function(err) {
                        req.session.save(function() {
                            res.redirect('/welcome');
                        });
                    });
                }
            });
            

        });

    });

    route.get('/register', function (req, res) {
        res.render('auth/register');
    });

    return route;
};