var assert = require('chai').assert;
var User = require('../user.js');

describe('User', function() {
    beforeEach(function(){
        user = new User('Jimmy', 'Blue');

    });
    it('has a name', function() {
        assert.equal('Jimmy', user.name);
    });
    it('has a colour', function() {
        assert.equal('Blue', user.colour);
    });
    it('has a colour code', function() {
        assert.equal('B', user.colourCode());
    });

    it('has an empty pieces array', function() {
        assert.equal(0, user.pieces.length);
    });
});
