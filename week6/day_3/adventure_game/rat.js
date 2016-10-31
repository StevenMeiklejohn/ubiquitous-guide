var Rat = function( size ) {
  this.size = size;
}


Rat.prototype = {
  touch: function(food) {
    food.poisoned = true;
  }
}


module.exports = Rat;