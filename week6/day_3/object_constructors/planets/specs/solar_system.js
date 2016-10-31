var solarSystem = require( '../solar_System');
var Planet = require( '../planet');

var assert = require( 'chai' ).assert;

var solarSystem1 = new solarSystem( 'Home', 'The Sun' )

describe( 'solarSystem', function() {

  it( 'should have no planets', function() {
    assert.deepEqual([], solarSystem1.planets);
    // use deepEqual to compare whole objects/arrays.
  })

  it( 'should add some planets', function() {
    // var solarSystem1 = new SolarSystem( "solarSystem1");
    var earth = new Planet( 'earth' );
    var mars = new Planet( 'mars' );

    solarSystem1.addPlanet( earth.planetName );
    solarSystem1.addPlanet( mars.planetName );

    assert.equal(2 , solarSystem1.planets.length);
    assert.deepEqual( ['earth', 'mars'], solarSystem1.planets );
  })

})



