// var testArray = [1,2,3,4];

// testArray.forEach(function(number){
//   console.log('thenumber is', number);
// });


// // or

// var testArray = [1,2,3,4];

// var loopFunc = function(number){
//   console.log('the number is ', number);
// }
// testArray.forEach(loopFunc);

// Make out own forEach function.


// var testArray = [1,2,3,4];
// // Example of test array

// var ourOwnForEach = function(callback, array){
//   // define ourOwnForEach as a function requiring a function and an array as arguements.
//   for (var i = 0; i < array.length; i++){
//     // handle the array. I will stand for index.
//     // i starts at 0 (count)
//     // loop no further than the array.length(iterations)
//     // increase i by one after each loop(increment)
//     callback(array[i]);
//     // use callback function with the item i (returned previously) as the arguement.
//   }
// };

// var callback = function(element){
//   // define callback as a function which requires an element from an array as an arguement.
//   console.log(element)
//   // print to the screen each element.
// }

// ourOwnForEach(callback, testArray)
// // Call, or use ourOwnForEach function, using function: callback and array: testArray as arguements.


var _ = require('lodash');
var testArray = [1,2,3,4];

var doubledArray = _.map(testArray, function(item){
  return item * 2;
})

console.log('doubled array = ', doubledArray);



