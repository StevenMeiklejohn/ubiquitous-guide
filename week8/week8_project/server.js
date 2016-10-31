var express = require('express');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var url = "mongodb://localhost:27017/blokus";

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.post('/savelog', function(req, res) {
    var data = req.body.data;
    var gameID = req.body.game;
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('game_logs');
        collection.update({game: gameID}, {game: gameID, data: data}, {upsert: true});
        db.close();
        res.status(200).end();
    });
});

app.post('/loadlog', function(req, res) {
    var gameID = req.body.game;
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('game_logs');
        collection.find({game: gameID}).toArray(function(err, docs) {
            res.json(docs);
            db.close();
        });
    });
});

app.use(express.static('client/build'));


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Blokus by BlokHeedz is Running on http://localhost:3000");
});
