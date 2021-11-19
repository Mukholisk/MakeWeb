var express = require('express')
var app = express()
var router = express.Router();
var path = require('path')

// 로그용
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth()+1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var hour = ('0' + today.getHours()).slice(-2);
var minute = ('0' + today.getMinutes()).slice(-2);
var second = ('0' + today.getSeconds()).slice(-2);
var logString = '['+year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second+'] ';

router.get('/', function(req, res){
    var id = req.user;
    if(!id){
        console.log(logString+"익명 유저의 로그아웃 시도를 거부했습니다.")
        res.redirect('/main')
    }
    else{
        console.log(logString+req.user.ID+"("+req.user.nickname+") 유저가 로그아웃합니다.")
        req.logout();
        req.session.save(function(){
            res.redirect('/');
        })
    }
});

module.exports = router;