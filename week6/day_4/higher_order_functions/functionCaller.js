// AM Lab question
// *see functionCaller.js

// 1. Write a function, functionCaller, that takes a function (myCallback) and a number as parameters. The functionCaller returns myCallback called with the number (as an argument).

var functionCaller = function(bananas, number){
  bananas(number);
};

var myCallback = function(num){
  console.log(num);
};

functionCaller(myCallback, 6);

// 2. You give a friend 50p to get you something form the shop.

// Write a function getSomethingFromTheShop, that takes in budget (as a string) and a callback function.

function callback(req, res){
  console.log("I wanted a " + req + "but all I got was a " + res);
}

function getSomethingFromTheShop(budget, callback){
  console.log("I have " + budget + " to go to the shop");
  callback("apple", "pear")
}

getSomethingFromTheShop('50p', callback);

// Invoke the callback function inside getSomethingFromTheShop and pass it two arguments (what you wanted from the shop and what you actually got).

// Finally, invoke the getSomethingFromTheShop function by passing it a string for the budget and an anonymous function as the callback.

// The anonymous callback function should have two parameters - req and res. (standing for request and response).

// In the getSomethingFromTheShop function include console.log("I have " + budget + " to go to the shop"); In the anonymous function include console.log("I wanted a " + req + " but all I got was a " + res);

// 3. Maths Fun: Write two functions increment and square. increment should take in a number and return the number plus 1. square should take in a number and return it multiplied by itself.

// Write another function called doSomeMathsForMe that takes in a number (n) and a function (a callback) and executes the callback, passing in n as an argument.

// Invoke doSomeMathsForMe by passing it a number and the increment and/or square function.

var increment = function(n){
  return n +1;
}

var square = function(n){
  return n*n;
}

var doSomeMathsForMe = function(n, method) {
  return method(n);
}

console.log(doSomeMathsForMe(5, square));
