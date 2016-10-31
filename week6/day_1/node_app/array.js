


var guitars = ["fender", "gibson", "gretsch"];

// This is an example of a 'constructor'
var drums = new Array();

drums.push( "yamaha" );
drums.push( "gretsch" );
drums[1] = 'zildijan';
// re-assign index position 1

drums[10] = "booms";
// assign array index and make everything in between = undefined



console.log( "guitars", guitars );
// print out all array
console.log( "drums", drums );
// print out all drums
console.log( "drums", drums[1] );
// print out drums array index1
console.log( "drums", drums.length );
// print how many intergers are in the array.
console.log( "drums", drums.pop() );
// Returns (but also removes) the first piece of data in the array.




console.log( drums.shift() );
// Returns (but also removes) the first piece of data in the array.

console.log( drums.slice() );
// Returns (but also removes) the first piece of data in the array.

console.log( drums.splice(0,1) );
// take index position zero and select 1 subsequent array entry.


console.log(drums.unshift('akjh'));
// Adds string to start of array.


drums.splice( 3, 1, 'akjh' );
// Adds string to end of array (replacing index item 3)









