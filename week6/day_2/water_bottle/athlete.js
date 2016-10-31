
var athlete = {
  hydration: 100,
  distanceCovered: 0,
  run: function( distance, pedometer) {
    if (this.isDehydrated()) return;
    this.dehydrate();
    this.distanceCovered += distance;
  },

  isDehydrated: function() {
    return this.hydration === 0;
  },
  dehydrate: function() {
    if(this.hydration <= 10)
      this.hydration = 0
    else
      this.hydration -=10;
  },
  drink: function(bottle) {
    this.hydration += bottle.drink();
  }
}



module.exports = athlete;