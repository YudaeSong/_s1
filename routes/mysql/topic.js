module.exports = function () {
  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();

  route.get(['/','/:id'], function(req, res){
    
    var sql = 'select id, title from topic';
    conn.query(sql, function (err, topics, fields){
      var id = req.params.id;
      if (id) {
        var sql = 'select * from topic where id=?';
        conn.query(sql, [id], function (err, topic, fields){
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Erroir');
          } else {
            res.render('topic/view', {topics:topics, topic:topic[0], user:req.user});
          }
        });
      } else {
        res.render('topic/view', {topics:topics, user:req.user})
      }
    });
    
    // Git Test
    // test 2 .. git
    

  });

  
  route.get('/add', function (req, res) {

    var sql = 'select id, title from topic';
    conn.query(sql, function (err, topics, fields){
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Erroir');
      }
      res.render('topic/add', {topics:topics, user:req.user});
    });
  
  });
  
  // 템플릿 엔진을 사용하여 
  route.post('/add', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'insert into topic(title, description, author) values(?,?,?) '
    conn.query(sql, [title, description, author], function(err, result, fields){
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Erroir');
      } else {
        res.redirect('/'+result.insertId);
      }
    });
  });
  
    

  route.get(['/:id/edit'], function(req, res){
    
    var sql = 'select id, title from topic';
    conn.query(sql, function (err, topics, fields){
      var id = req.params.id;
      if (id) {
        var sql = 'select * from topic where id=?';
        conn.query(sql, [id], function (err, topic, fields){
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Erroir');
          } else {
            res.render('topic/edit', {topics:topics, topic:topic[0], user:req.user});
          }
        });
      } else {
        console.log('thie is no id.');
        res.status(500).send('Internal Server Erroir');
      } 
    });
  });  
  

  
  route.post(['/:id/edit'], function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
  
    var sql = 'update topic set title=?, description=?, author=? where id=?'
    conn.query(sql, [title, description, author, id], function(err, result, fields){
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Erroir');
      } else {
        res.redirect('/'+id);
      }
    });
  
  });
  
  
  route.get(['/:id/delete'], function(req, res){
    var sql = 'select id, title from topic';
    var id= req.params.id;
  
    conn.query(sql, function (err, topics, fields){
      var sql = 'select * from topic where id=?';
      conn.query(sql, [id], function(err, topic){
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Erroir');
        } else {
          if (topic.length ===0) {
            console.log('There is non record.');
            res.status(500).send('Internal Server Erroir');
          } else {
            res.render('topic/delete', {topics:topics, topic:topic[0], user:req.user});
          }
        }
    
      });
  
    });
  });
  
  route.post(['/:id/delete'], function(req, res){
  
    var sql = 'delete from topic where id=?';
    var id= req.params.id;
  
    conn.query(sql, [id], function (err, result){
      res.redirect('/')
    });
  });

  return route;
}