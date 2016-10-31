var Planet = require( '../planet');
var assert = require( 'chai' ).assert;


var planet1 = new Planet( 'Mercury' )

describe( 'solar system', function() {

  it( 'should have a name', function() {
    assert.equal('Mercury', planet1.planetName);
  })



})


