var express = require('express');
var app = express();
var path = require('path');
// var fs = require('fs');
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// var MongoClient = require('mongodb').MongoClient
// var url = 'mongodb://localhost:27017/comment_application';

// app.get('/api/comments', function(req,res){
//   MongoClient.connect(url, function(err, db) {
//     var collection = db.collection('comments');
//     collection.find({}).toArray(function(err, docs) {
//       res.json(docs);
//       db.close();
//     });
//   });
// })

// app.post('/api/comments', function(req,res){
//   MongoClient.connect(url, function(err, db) {
//     var collection = db.collection('comments');
//     collection.insert(
//       { "author": req.body.author,
//         "text": req.body.text,
//       }
//     )
//     res.status(200).end()
//     db.close();
//   });
// })

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.use(express.static('client/build'));


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
