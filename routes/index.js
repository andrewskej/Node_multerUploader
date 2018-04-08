var express = require('express');
var router = express.Router();
var app = express();

var multer = require('multer');
var path = require('path');
var upload = multer({
    _storage:multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,'./public/uploads');
        },
        filename:function(req,file,cb){
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    })
});

var mysql = require('mysql'); 
var pool = mysql.createPool({
    connectionLimit: 10,
    host :'localhost',
    user:'root',
    password:'wjssbdhQk3',
    database:'test'
  });


  
router.get('/', function(req, res, next) {
   pool.getConnection(function(err,connection){
        var query = "select * from imgUp";
        connection.query(query,function(err,results){
        res.render('index',{results:results});
        });
   });
});



router.post('/fileUp',upload.single('imgfile'),function(req,res){
    var imgName = req.file.originalname;
    pool.getConnection(function(err,connection){
        var query = "insert into imgUp (imgName) values (?)";
        connection.query(query,[imgName],function(err,results){
        });
    });
    res.redirect('/');
});


router.get('/fileDel/:imgNo',function(req,res){
    pool.getConnection(function(err,connection){
        var imgNo = req.params.imgNo;
        var query = "delete from imgUp where imgNo =?";
        connection.query(query,[imgNo],function(err,result){
        });
    });
    res.redirect('/');
});


module.exports = router;
