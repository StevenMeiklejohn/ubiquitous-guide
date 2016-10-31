// an example of a synchronous proghram which doe ot continue until the file has been read.

// var fs = require('fs');

// var buffer =fs.readFileSync("us_states.txt");
// var bufferString = buffer.toString();

// var newLineCount = bufferString.split("\n").length;

// console.log("There are " + newLineCount + "lines in the file");


var fs = require('fs');

fs.readFile('us_states.txt', "utf-8", function(err, data){

  if(err){ console.log("Uh-oh! " + err);
}
else{
  var bufferString = data;
  var newLineCount = bufferString.split("\n").length;
  console.log("There are " + newLineCount + "lines in the file");
}
});

console.log("Oh where has Oregon? She's gone to Oklahoma");