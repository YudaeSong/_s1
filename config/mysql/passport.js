
module.exports = function(app) {

    var conn = require('./db')();

    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());



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


    // 최조 로그인 성공 세션에 저장
    passport.serializeUser(function(user, done) {  // 최초 로그인 성공시
        console.log('serializeUser', user);
        done(null, user.authId);  // user의 고유한 아이디를 사용한다. 보통은 사용자 아이디 : user.id  // 이후 passport.deserializeUser 가 실행됨.
    });

    // 이미 로그인 되었을 경우 세션
    passport.deserializeUser(function(id, done) {  // 이미 로그인 되었을 경우에...
        console.log('deserializeUser', id);

        var sql = 'select * from users where authId=?';
        conn.query(sql, [id], function(err, results) {
            // console.log(sql, err, results);
            if(err){
                console.log(err);
                return done('There is no user.');            
            } else {
                done(null, results[0]);
            }

        });

    });

    // 페스포트중 로컬로그인
    passport.use(new LocalStrategy(
    function(username, password, done) {
        var uname = username;
        var pwd = password;

        var sql = 'select * from users where authId=?';
        conn.query(sql, ['local:'+uname], function(err, results) {
            //console.log(results);
            if(err){
                return done('There is no user.');            
            }
            var user = results[0];
            return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash) {
                if (hash === user.password) {  // 로그인 성공
                    console.log('LocalStrategy', user);
                    done(null, user);   // 이때 최초로그인 시  passport.serializeUser 가 실행되고, 이미 로그인 딩어 있다면 passport.deserializeUser 가 실행됨.
                } else {
                    done(null, false);         // 로그인 실패
                }
            });


        });

    }
    ));

    // 페이스북 로그인
    passport.use(new FacebookStrategy({
        clientID: '459735781511605', // FACEBOOK_APP_ID,
        clientSecret: '6cfe32991b4743b95bc36eb726135edd', // FACEBOOK_APP_SECRET,
        callbackURL: "https://632cc891.ngrok.io/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'link', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var authId = 'facebook:' + profile.id;

        var sql = 'select * from users where authId=?';
        conn.query(sql, [authId], function(err, results) {
            if(results.length>0){         // 이미 사용자 정보에 있으면
                done(null, results[0]);   // 세션에 저장
            } else {                      // 사용자 정보에 없으면
                var newuser = {
                    'authId' :  authId,
                    'displayName' : profile.displayName,
                    'email' : profile.emails[0].value
                };
            
                var sql = 'insert into users set ?'
                conn.query(sql, newuser, function(err, results){
                    if (err){
                        console.log(err);
                        done('Error');                    
                    } else {
                        done(null, results[0]);
                    }
                });
            }
        });
    }
    ));

    return passport;
}