// Javascript
// +++++++++++


// This is my bear.
var myBear = "Yogi";

// Is not the same as
//  myBear = "Yogi";
// Always use var myBear. This assigns a local variable, so re-assigning the variable within a function will not effect other functions.

// instead of def and end we use funtion and curly brackets.
// Functions and such cannot begin with a number or special characters (excluding $ and _ which can be used.)
function hello(name){
// Instead of saying puts, we say console.log;
console.log(name + " you are awesome! ");
}

// to call the function. Use the same method as Ruby.

hello ("Steven");

// in the console type: node app.js 

//  We can also use variable such as;

// hello (myBear);


