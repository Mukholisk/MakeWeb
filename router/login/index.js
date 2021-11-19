var express = require('express')
var app = express()
var router = express.Router();
var path = require('path') // 상대경로
var mysql = require('mysql')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

// 로그용
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth()+1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var hour = ('0' + today.getHours()).slice(-2);
var minute = ('0' + today.getMinutes()).slice(-2);
var second = ('0' + today.getSeconds()).slice(-2);
var logString = '['+year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second+'] ';

// database setting
var connection = mysql.createConnection({
    host: 'localhost',
    port : 3306,
    user: 'root',
    password : '',
    database : 'userdb'
})
connection.connect();

router.get('/', function(req, res){
    var msg;
    var errMsg = req.flash('error')
    if(errMsg) msg = errMsg;
    console.log(logString+'익명의 유저가 로그인 중입니다.')
    res.render('login.ejs', {'message' : msg});
})

passport.serializeUser(function(user, done){
    console.log(logString+'passport session save: '+ user.ID + '(' + user.nickname + ')')
    done(null, user)
});
passport.deserializeUser(function(user, done){
    var ID = user.ID;
    var nickname = user.nickname;
    // console.log('passport session get ID: '+ ID + '(' + nickname + ')')
    done(null, {'ID': ID, 'nickname':nickname}); // 세션에서 값을 뽑아서 페이지에 전달하는 역할
})

passport.use('local-login', new LocalStrategy({
        usernameField: 'ID',
        passwordField: 'password',
        passReqToCallback: true
     }, function(req, ID, password, done){
            var query = connection.query('select * from userDB where ID=?', [ID], function(err, rows){
            if(err) return done(err);
            
            if(rows.length){ // database에 입력한 ID값이 있는가?
                if(password == rows[0].password){ // 비밀번호와 확인이 같은가?
                    console.log(logString+"로그인 알림: "+ ID +"(" + rows[0].nickname + ")")
                    return done(null, {'ID' : ID, 'nickname' : rows[0].nickname});
                }
                else{
                    console.log(logString+"로그인 알림: 잘못된 비밀번호입니다.(시도된 아이디: "+ID+")")
                    return done(null, false, {message : '잘못된 비밀번호입니다.'})
                }
            }
            else{
                console.log(logString+"로그인 알림: ID를 찾을 수 없습니다.(시도된 아이디: "+ID+")")
                return done(null, false, {message : 'ID를 찾을 수 없습니다.'})
            }
        })
    }
));

router.post('/', passport.authenticate('local-login', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router;