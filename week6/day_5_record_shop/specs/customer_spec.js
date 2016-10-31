var assert = require('chai').assert;
var RecordStore = require('../record_shop');
var Record = require('../record');
var Customer = require('../customer');

describe('customer', function() {

  beforeEach(function() {
    record_shop = new RecordStore('Spin The Black Circle', 'Glasgow', 2000 );
    record1 = new Record(1, 'Portishead', 'Dummy', 18);
    record2 = new Record(2, 'Brand New', 'Daisy', 20);
    customer1 = new Customer('Nathan Barley'); 
  
  })

  it( 'should have a name', function() {
    assert.equal('Nathan Barley', customer1.name);
  })

  it( 'should be able to add records to collection', function() {
    var record1 = new Record(5, 'Deftones', 'Around The Fur', 18);
    customer1.addRecord( record1 )
    var record2 = new Record(6, 'Brand New', 'Deja Entendu', 18);
    customer1.addRecord( record2 )
      assert.deepEqual([
        {'id': 5, 'artist': 'Deftones', 'title': 'Around The Fur', 'price': 18},
        {'id': 6, 'artist': 'Brand New', 'title': 'Deja Entendu', 'price': 18}
         ], customer1.collection);
  })

  it( 'should be able to sell a record. Decrease customer inventory. Increase store inventory', function() {
    var record1 = new Record(5, 'Deftones', 'Koi No Yokan', 18);
    customer1.addRecord( record1 );
    var record2 = new Record(6, 'Mclusky', 'Do Dallas', 20);
    customer1.addRecord( record2 );
    console.log(customer1.collection);
    customer1.sellRecord( record1 );
    assert.deepEqual([
      {'id': 5, 'artist': 'Deftones', 'title': 'Koi No Yokan', 'price': 18}], customer1.collection);
    // assert.deepEqual([
    //   {'id': 1, 'artist': 'Portishead', 'title': 'Dummy', 'price': 18},
    //   {'id': 2, 'artist': 'Brand New', 'title': 'Daisy', 'price': 20},
    //   {'id': 6, 'artist': 'Brand New', 'title': 'Deja Entendu', 'price': 18}
    //   ], record_shop.inventory);
  })





})