var _ = require('lodash');


// var robot = {
//   bestFriend: "Steve",
//   welcome: function(){
//     return "Hello " + this.bestFriend;
// alternatively..return "Hello " + robot.bestFriend;
//   }
// }

// In javascript, 'this' is a keyword, like 'self' in Ruby.
// #==>



// Using the lodash method:

var robot = {
  bestFriend: "Steve",
  welcome: function(){
    return "Hello " + _.capitalize(this.bestFriend);
// alternatively..return "Hello " + robot.bestFriend;
  }
}



module.exports = robot;












