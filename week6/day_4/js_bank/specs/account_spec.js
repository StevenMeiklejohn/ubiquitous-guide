var Account = require('../account');
var assert = require('chai').assert;  

describe('account', function() {

  beforeEach(function(){
    account1 = new Account('Jim', 1000, 'personal');
    account2 = new Account('Beverley', 999, 'business');
  })

  it('should have a name', function() {
    assert.equal('Jim', account1.name);
  })

  it('should have a value', function() {
    assert.equal(999, account2.value);
  })

  it('should have a type', function() {
    assert.equal('business', account2.type);
  })





  
})