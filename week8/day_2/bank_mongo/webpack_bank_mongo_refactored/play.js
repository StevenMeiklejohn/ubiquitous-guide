var MongoClient = require('mongodb').MongoClient

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, db) {
  var collection = db.collection('accounts');
  collection.find({}).toArray(function(err, docs) {
    db.close();
  });
});

// MongoClient.connect(url, function(err, db) {
//   var collection = db.collection('accounts');
//   // Insert some documents
//   collection.insertMany([
//     { "owner": "rick",
//       "amount": 225.50,
//       "type": "personal"
//     }
//   ])
//   db.close();
// });
