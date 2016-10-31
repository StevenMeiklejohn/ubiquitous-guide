// Example of global variable (can be 'seen' by evereything). These are dangerous and should be avoided.
var name = "Keith";

var talk = function() {
  var name = 'Rick'
  console.log( 'My name is ' + name );
}


// This will not work because this command does not have access to var name = 'Rick' which has a variable scope (restricted to the variable)
// console.log( 'My name is ' + name:);

var walk = function() {
  console.log( name + ' is walking' );
}


talk();
walk();

// *Note. if no global variable is declared, JS will set the 'name' inside a function as a global variable (as long as there is no 'var' before the name in the function.)



// Closures.
// ==========

var greet = function( isHappy ) {
var text = '';
  if (isHappy) {
   text=( 'Hello friend' );
  }else{
    text=( 'mind your own business' );
  }
  var displayText = function() {
    console.log( text )
  }
  displayText()
}

greet( true )

// Returns 'Hello friend'
// If greet is 'false', returns 'mind your own business'






episode 1 = Kieth 
episode 2 = 3
episode 3 = Keith





