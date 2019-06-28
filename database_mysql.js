var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tkswlrl',
  database : 'o2'
});

conn.connect();

conn.query('SELECT * from topic', function (error, rows, fields) {
  if (error) {
    console.log(err);
  };
  console.log('Rows: ', rows);
  console.log('Fields: ', fields);
});

conn.end();