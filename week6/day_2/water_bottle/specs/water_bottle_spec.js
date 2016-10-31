var assert = require( 'chai' ).assert;
var bottle = require( '../water_bottle' );


describe( 'Water Bottle', function() {
  beforeEach(function(){
    bottle.volume=0;
  });
  it( 'should be empty at start', function() {
    assert.equal(0, bottle.volume );
  });

  it( 'should fill up to 100', function() {
    bottle.fill();
    assert.equal( 100, bottle.volume );
  });

  it( 'should go down by ten when drunk', function() {
    bottle.fill();
    var startValue = bottle.volume
    bottle.drink();
    assert.equal(startValue - 10, bottle.volume);
  });

  it( 'should go to 0 when emptied', function() {
    bottle.empty();
    assert.equal(0, bottle.volume);
  });

  it( 'should not be able to go below 0', function() {
    bottle.empty();
    bottle.drink();
    assert.equal(0, bottle.drink());
  });

  it( 'should return hydration value when drink 0', function() {
    bottle.volume = 5;
    assert.equal(5, bottle.drink());
  });
})