// Create an object. (Key value pair)
// Java will automatically turn the key into a string.

var myPerson = {
  name: 'Guybrush',
  age: 32,
  weapon: 'cutlass',
// We can also create an object within an object (hash within a hash)
  address: { street: 'Pirate Way', postcode: 'EH1 4AL' },
// We can also pass in a function!......
  myFunc: function(){
    console.log( 'My first JS method')
  }
}

console.log( myPerson )

// To access the function.....
myPerson.myFunc()

console.log( 'my person', myPerson )

// check type of object.
console.log( 'my person', typeof(myPerson) )
// *Note the 'my person' is purely to make the code more readable.


// So, to return the name we can we use th fact the hash is an object.

console.log( 'my person', myPerson.age )

console.log( 'my person', myPerson.name )

// or pass in a string to match the key of what we want;
// This is much more useful for dymanic methods.

console.log( 'my person', myPerson['name'] )


var propertyName = 'weapon'

console.log( myPerson.myPerson )
// This won't work......

console.log( myPerson[propertyName])
// This will work.


// We can also create a new key value pair like so.....
myPerson.pet = 'parrot'
console.log( myPerson)


//  We can also modify the data in the hash/object.....
myPerson.age = 52;
console.log( myPerson )

// or.......
myPerson.age += 20
console.log( myPerson )

// To access an object within an object.....
console.log( myPerson.address['street'] )

// Or 
console.log( myPerson.address.street )


var caesar = {
  city: 'Rome'
}

var cleopatra = {
  city: 'Cairo'
}

var cicero = {
  city: 'Rome'
}

var historyLesson = [ caesar, cleopatra, cicero ]
console.log( historyLesson )
// Returns array

console.log( historyLesson[1] )
// returns {city: Cairo}

console.log( historyLesson[1].city )
// returns Cairo.

console.log( historyLesson[1].city[2] )
// returns i (from Cairo)






