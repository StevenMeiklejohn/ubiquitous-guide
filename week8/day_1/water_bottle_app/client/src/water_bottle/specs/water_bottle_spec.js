var assert = require('chai').assert;
var bottle = require('../water_bottle.js')

describe('Water bottle', function(){
  beforeEach(function() {
    bottle.volume = 0;
  });
  it('should be empty at start', function(){
    assert.equal(0, bottle.volume);
  });
  it('should go to 100 when filled', function(){
    bottle.fill();
    assert.equal(100, bottle.volume);
  });
  it('should go down by 10 when drunk', function(){
    bottle.fill();
    var startValue = bottle.volume
    bottle.drink();
    assert.equal(startValue - 10, bottle.volume);
  })
  it('should go to 0 when emptied', function(){
    bottle.empty();
    assert.equal(0, bottle.volume);
  });
  it('should not be able to go below 0', function(){
    bottle.empty();
    bottle.drink();
    assert.equal(0, bottle.volume);
  });
  it('should return hydration value when drink 0', function(){
    bottle.fill();
    assert.equal(10, bottle.drink());
  });
  it('should return the dregs', function(){
    bottle.volume = 5;
    assert.equal(5, bottle.drink());
  });
});
