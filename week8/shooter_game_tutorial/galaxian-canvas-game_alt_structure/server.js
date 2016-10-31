var express = require('express');
var app = express();

// define index/home page
var path = require('path');




app.use(express.static('client/build'));

// localhost3000 + /, callback(request coming in, response sending back)
app.get('/', function(req, res){
  res.sendFile(path.join__dirmane + '/client/build/space_shooter.html');
})

// // index
// app.get('/planets', function(req, res){
//   res.json(planets);
// })

// // new
// app.get('planets/new', function(req, res){
//   // res.json({mane: "This is the new route"});
//   res.send("This is the new route");
// })

// // create
// app.post('/planets', function(req, res){
//   res.send("This is the create route");
//   })

// // show
// app.get('/planets/:id', function(req, res){
//   res.json(planets[req.params.id-1]);
// })

// // edit
// app.get('/planets/:id', function(req, res){
//   res.send("This is the edit route");
// })

// // update
// app.put('/planets/:id', function(req, res){
//   res.send("This is the update route");
// })

// // delete
// app.delete('/planets/:id', function(req, res){
//   res.send("This is the delete method");
// })

app.listen('3000', function(){
  console.log("The magic is all happening on port 3000");
})


















