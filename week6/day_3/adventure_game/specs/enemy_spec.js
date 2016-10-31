var hero = require( '../hero');
var food = require( '../food');
var rat = require( '../rat');
var enemy = require( '../enemy');
var assert = require( 'chai' ).assert;


describe( 'enemyTests', function() {

  beforeEach(function() {
    hero1 = new hero( 'Conan', 100, 'Chicken', true, true, 'alive');
    enemy1 = new enemy( 'Harry The Bastard', 200, 50, true, true, 'alive');
  })

  it( 'should have a blood curdling cry!', function() {
    assert.equal('Beware! For my name is Harry The Bastard', enemy1.talk())
  })
  it( 'should be able to inflict damage to the hero', function() {
    enemy1.inflictDamage(hero1);
    assert.equal(50, hero1.health)
  })
});