var express = require('express');
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/bucket_list_app';

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/bucketList', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    var collection = db.collection('bucket_countries');
    collection.find({}).toArray(function(err, docs) {
      res.json(docs);
      db.close();
    });
  });
});

app.post('/bucketList', function(req,res){
  console.log('body', req.body)
  MongoClient.connect(url, function(err, db) {
    var collection = db.collection('bucket_countries');
    collection.insert(req.body.country)
    res.status(200).end()
    db.close();
  });
})

app.use(express.static('client/build'));


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
