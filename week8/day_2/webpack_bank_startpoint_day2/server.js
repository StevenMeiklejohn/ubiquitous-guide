//Refactored
// var express = require('express');
// var app = express();
// var path = require('path')

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// app.use(express.static('client/build'));


// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);
// });




var express = require('express');
var app = express();
var path = require('path')
var fs = require('fs');
// locates json file and sets it to variable.
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var url = 'mongodb://localhost:27017/bank';

app.use(bodyParser.json());


app.get('/accounts', function(req, res){
 var url = 'mongodb://localhost:27017/bank';
 MongoClient.connect(url, function(err, db){
    var collection = db.collection('accounts');
    collection.find({}).toArray(function(err, docs){
      res.json(docs);
      db.close;
    });
 })
  // fs.readFile(ACCOUNTS_FILE, function(err, data){
  //   if(err){console.log(err);
  //     return;
  //   }
  //   res.json(JSON.parse(data));
  // })
})

app.post('/accounts', function(req, res){
  console.log('Body: ', req.body);
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('accounts');
    collection.insert(
      req.body
      )
    })
  res.status(200).end();
})

app.delete('/accounts', function(req, res){
  console.log('Body: ', req.body);
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('accounts');
    collection.insert(
      req.body
      )
    })
  res.status(200).end();
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.use(express.static('client/build'));


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
