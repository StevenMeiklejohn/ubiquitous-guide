// ### JS Prototype Lab

// 1. Create a constructor to create bears. Bears should have an age, type, weight and it should be able to roar and eat.  Eating should increase it's weight.

// 2. Refactor this so that the roar and eat method is on the Bear constructor prototype.

// Create paramaters which all bears have
var Bear = function( age, type, weight ) {
  this.age = age;
  this.type = type;
  this.weight = weight;
}

// Create methods which all bears can use (Bear.prototype)
Bear.prototype = {
    eat: function() {
  console.log( 'Munch, munch, munch' );
  this.weight += 10;
  },
    roar: function() {
  console.log( 'Roooooooaaaaaaaarrrrrrr');
}
}

// Create an instance of a new bear
var yogi = new Bear(12, 'brown', 500)
// output to the console yogi.weight. (i.e. apply method 'weight' to instance 'yogi')
console.log(yogi.weight)
yogi.eat();
console.log(yogi.weight)
yogi.roar();





