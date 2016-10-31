var waterBottle = {
  volume: 0,
  hydrationValue: 10,
  fill: function(){
    this.volume = 100;
  },
  drink: function(){
    if(this.volume < this.hydrationValue){
      var amountLeft = this.volume
      this.volume = 0
      return amountLeft
    }
    this.volume -= this.hydrationValue;
    return this.hydrationValue;
  },
  empty: function(){
    this.volume = 0;
  }
}


module.exports = waterBottle;
