var Enemy = function( name, health, damage, attack, attacked ) {
  this.name = name;
  this.health = health;
  this.damage = damage;
  this.attack = attack;
  this.attacked = attacked;
}

Enemy.prototype = {
  talk: function() {
    var talk = ("Beware! For my name is " + this.name);
    return talk
  },
  inflictDamage: function(hero) {
    console.log(hero);
    console.log(this);
    if(this.attack === true && hero.attacked === true){
      hero.health -= 50 };
      return hero.health
    }
    }
  


module.exports = Enemy;