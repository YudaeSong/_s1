
var bodyParser = require('body-parser');  // POST 값 사용
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'pug');   // 템플릿 엔진 설정
app.set('views', './views');     // 탬플릿이 보관되는 경로
app.locals.pretty = true;

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.get('/form', function (req, res) {
  res.render('form');
});

app.get('/form_receivar', function (req,res) {
  var title = req.query.title;
  var description = req.query.description;
  res.send(title+','+description);

});

app.post('/form_receivar', function (req,res) {
  var title = req.body.title;
  var description = req.body.description;
  res.send(title+','+description);

});


// 템플릿 엔진을 사용하여 
app.get('/topic', function (req, res) {
  var topics = [
    'Javascript is....', 'Nodejs is...','Express is ...'
  ];
  var output = `
  <a href="/topic?id=0">javascript</a><br>
  <a href="/topic?id=1">nodejs</a><br>
  <a href="/topic?id=2">express</a><br>
  ${topics[req.query.id]}
  `
  res.send(output);
});


app.use(express.static('public'));

// 템플릿 엔진을 사용하여 
app.get('/template', function (req, res) {
  res.render('temp', {time:Date(), title:'PUG'});
});

app.get('/onebin', function (req, res) {
    res.send('Hello World! <img src="/원빈.jpg">');
});

app.get('/dynamic', function(req, res) {
    var lis = '';
    for (let i = 0; i < 5; i++) {
      lis = lis + '<li>coding </li>';
    }
    var dd = Date();
    var output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        Hello, Static
        <ul>
            ${lis}
        </ul>
        ${dd}
        
    </body>
    </html>    
    `;
    res.send(output);
    
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

