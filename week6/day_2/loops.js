 // Loops.
 // =======

//  FOR LOOP
// ==================


// Initialize. Define starting position.....i = 0
// Condition. Loop continues only if..... i < 5 is true.
// Increment. In each loop, add 1 to i
 for ( var i = 0; i < 5; i += 1 ) {
  // print loop to console.
  console.log(i);
  }

// =============================


//  A more practical application could be
  var pets = [ "dog", "cat", "pika" ]

  // Initialize. Define starting position.....i = 0
  // Condition. Loop continues only eacj time for the length of pets.
  // Increment. In each loop, add 1 to i
   for ( var i = 0; i < pets.length; i += 1 ) {
    // print loop to console.
    console.log(pets[i]);
    }
// =================================



// FOR/OF LOOPS (Only available on ES6.)
// ================
var pets = [ "dog", "cat", "pika" ]
// Assign each array data ntry to 'pet' on loop.

for( var pet of pets ) {
  console.log( pets )
}
// ==============================

// FOR/IN Loops
//================


var pets = [ "dog", "cat", "pika" ]

for (var pet in pets ) {
  // assign each array index number to pet for each iteration.

  console.log( pets[pet] )
 }

 // ===================================

 var pets = [ "dog", "cat", "pika" ];
 var obj = {
  student1: 3,
  student2: 12,
  student3: 40
 }

for ( var key in obj ) {
  console.log( obj[key] )
}
// =========================================



// Equivelant of while loop
// ===========================================

var x = 0;
while ( x < 10 ) {
  console.log( "loop " + x );
  x = x +2;
  // Or x++;
}

// ======================================






