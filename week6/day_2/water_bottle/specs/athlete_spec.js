var athlete = require( '../athlete' );
var bottle = require( '../water_bottle' );
var assert = require( 'chai' ).assert;

describe( 'athlete', function() {

  beforeEach(function() {
    athlete.hydration = 100;
    athlete.distanceCovered = 0;
    bottle.volume = 100;
  });


  it('should have a hydration attribute that starts at 100', function(){
    assert.equal(100, athlete.hydration);
  });

  it('should have a distance covered attribute starts at 0', function() {
    assert.equal(0, athlete.distanceCovered)
  });

  it('should be able to run: increasing distance, decreasing hydration', function() {
    athlete.run(10);
    assert.equal(90, athlete.hydration);
    assert.equal(10, athlete.distanceCovered);
  });

  it('should not go below 0 hydration', function() {
    athlete.hydration = 2;
    athlete.dehydrate();
    assert.equal(0, athlete.hydration)
  });

  it( 'should not move when running dehydrated: hydration at 0', function() {
    athlete.hydration = 0;
    athlete.run(10);
    assert.equal(0, athlete.hydration);
    assert.equal(0, athlete.distanceCovered);
  });

});


