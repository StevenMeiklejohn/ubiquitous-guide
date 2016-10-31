var Bank = require('../bank');
var Account = require('../account');
var assert = require('chai').assert;                                         

describe('bank', function() {

  beforeEach(function(){
    bank = new Bank('S&D Banking Corp');
    account1 = new Account('Jim', 1000, 'personal');
    account2 = new Account('Beverley', 999, 'business');
    bank.add(account1);
    bank.add(account2);
  })

  it('should start have accounts', function() {
    assert.equal(2, bank.accounts.length);
  })

  it("should be possible to find an account given its owner's name", function() {
    result = bank.find('Jim');
      assert.deepEqual(account1, result);
  })

  it("should be able to find the largest account", function() {
    result = bank.findLargest();
    // console.log(result);
    assert.deepEqual(account1, result);
  })

  it( 'should find the total account value', function() {
    assert.equal( 1999, bank.total());
  })

  it('should be able to find the average account value', function() {
    assert.equal(999.5, bank.average());
  })

  it('should be able to find the total value for a given account type', function() {
    result = bank.largestByType('personal');
    console.log(result);
    assert.equal(1000, result);
    })

  
})