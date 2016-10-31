var Hero = function( name, health, favFood, attack, attacked, status ) {
  this.name = name;
  this.health = health;
  this.favFood = favFood;
  this.attack = attack;
  this.attacked = attacked;
  this.status = status;
}

Hero.prototype = {
  talk: function() {
    var talk =  ("Hello! My name is " + this.name);
    return talk
  },
  eat: function(food) {
    if(food.name === this.favFood){
      this.health += (food.healthUp * 1.5)
    }
    else if(food.poisoned === true){
      this.health -= (food.healthUp / 2)
    }
    else
    {
    this.health += food.healthUp
    }
  },
  inflictDamage: function(enemy) {
    if(this.attack === true && enemy.attacked === true){
      enemy.health -= 30 };
      return enemy.health
    },
  check_status: function() {
      if(this.health <= 0){
        this.status = 'dead';
      }
      else
      {
        this.status = 'alive';
      }
      return this.status;
      }
}

module.exports = Hero;