
var bodyParser = require('body-parser');  // POST 값 사용
var express = require('express');
var app = express();
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');   // 템플릿 엔진 설정
app.set('views', './views_file');     // 탬플릿이 보관되는 경로
app.locals.pretty = true;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/topic/new', function (req, res) {
  res.render('new');
});

// 템플릿 엔진을 사용하여 
app.get('/topic', function (req, res) {

  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Erroir');
    }
    res.render('view', {topics:files});
  });
});

app.get('/topic/:id', function(req, res){
  var id = req.params.id;

  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Erroir');
    }
    fs.readFile('data/'+id, 'utf8', function(err,data) {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Erroir');
      }
      res.render('view', {topics:files, title:id, description:data})
    });
  });

});



// 템플릿 엔진을 사용하여 
app.post('/topic', function (req, res) {
  var title = req.body.title;
  var description = req.body.description;

  fs.writeFile('data/' + title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Erroir');
    }
    res.send(title+','+description);
  });

});


app.use(express.static('public'));

// 템플릿 엔진을 사용하여 
app.get('/template', function (req, res) {
  res.render('temp', {time:Date(), title:'PUG'});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

