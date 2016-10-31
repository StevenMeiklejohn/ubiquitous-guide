var hero = require( '../hero');
var food = require( '../food');
var rat = require( '../rat');
var enemy = require( '../enemy');
var assert = require( 'chai' ).assert;

describe( 'ratTests', function() {

  beforeEach(function() {
    hero1 = new hero( 'Conan', 100, 'Ham');
    rat1 = new rat(1);
    rat2 = new rat(2);
    rat3 = new rat(3);
    food1 = new food( 'Ham', 30);
  })

it( 'should have a size', function() {
    assert.equal(1, rat1.size);
})

it( 'can poison food, causing hero to lose health', function() {
  rat1.touch(food2);
  hero1.eat(food2);
  assert.equal(85, hero1.health)
})

})