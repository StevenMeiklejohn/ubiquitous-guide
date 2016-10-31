// Creating a basic function.

function hello() {
  console.log("hello everyone");
}

hello();

// ============================


// Javascript requires an explicit return. Otherwise it will return undefined.
function add(a,b) {
  return a + b;
}

console.log("result: " + add(1,2));

// ================================

// Passing in multiple arguements

function printName(name, mood, weather){
  console.log(name + " you are " + mood + " the weather is " + weather);
}

printName("Steve", "happy", "sunny");

// ==================================

// Write a function with an unknown number of arguements
// We use the keyword 'arguements'

function sum() {
  console.log(arguments);
}

sum(1, 2, 3, 4, 5, 6);

// ====================================

// We can also assign functions to variables:
//  Declare
var hello = function() {
  console.log('HELLO');
}
 // Invoke.
 hello();

 // ======================================


// Re-write the add function such that it gets assigned to a variable;

var add = function(a,b) {
  return a + b;
}

console.log("result: " + add(1,2));


// =====================================

// Anonymous functions: An anonymous function is a function with no defined name which is called on a variable with no defined name.
// IN the example below we are calling a function in a variable.

var greater = function(a,b) {
  if(a > b) return a;
  return b;
}

// console.log("result: " + greater(1,2));

var wow = function(functionToInvoke) {
  console.log(functionToInvoke(2,1));
}

wow (greater);





