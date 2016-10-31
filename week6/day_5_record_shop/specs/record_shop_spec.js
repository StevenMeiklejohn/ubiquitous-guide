var assert = require('chai').assert;
var RecordStore = require('../record_shop');
var Record = require('../record');
var Customer = require('../customer');

describe('record_shop', function() {

  beforeEach(function() {
    record_shop = new RecordStore('Spin The Black Circle', 'Glasgow', 2000 );
    record1 = new Record(1, 'Portishead', 'Dummy', 18);
    record2 = new Record(2, 'Brand New', 'Daisy', 20);
    customer1 = new Customer('Nathan Barley');
  })

  it( 'should have a name', function() {
    assert.equal('Spin The Black Circle', record_shop.name);
  })

  it( 'should have a city', function() {
    assert.equal('Glasgow', record_shop.city);
  })

  it( 'should have a starting cash balance', function() {
    assert.equal(2000, record_shop.cash);
  })

  it( 'should be able to add records to inventory', function() {
    var record1 = new Record(1, 'Portishead', 'Dummy', 18);
    record_shop.addRecord( record1 )
    assert.deepEqual([{'id': 1, 'artist': 'Portishead', 'title': 'Dummy', 'price': 18} ], record_shop.inventory);
  })

  it( 'should be able to list inventory', function() {
    var record1 = new Record(1, 'Portishead', 'Dummy', 18);
    record_shop.addRecord( record1 )
    var record1 = new Record(2, 'Brand New', 'Daisy', 20);
    record_shop.addRecord( record1 )
    var record2 = new Record(2, 'Pearl Jam', 'Vitalogy', 20);
    record_shop.addRecord( record2 )
    var record3 = new Record(3, 'Pearl Jam', 'No Code', 25);
    record_shop.addRecord( record3 )
    var record4 = new Record(4, 'Deftones', 'Koi No Yokan', 19);
    record_shop.addRecord( record4 )
    assert.deepEqual([
      {'id': 1, 'artist': 'Portishead', 'title': 'Dummy', 'price': 18},
      {'id': 2, 'artist': 'Brand New', 'title': 'Daisy', 'price': 20},
      {'id': 2, 'artist': 'Pearl Jam', 'title': 'Vitalogy', 'price': 20},
      {'id': 3, 'artist': 'Pearl Jam', 'title': 'No Code', 'price': 25},
      {'id': 4, 'artist': 'Deftones', 'title': 'Koi No Yokan', 'price': 19},
       ], record_shop.listInventory());
  })

  it( 'should be able to sell a record (add money and remove from inventory)', function() {
    var record1 = new Record(1, 'Portishead', 'Dummy', 18);
    record_shop.addRecord( record1 )
    var record2 = new Record(2, 'Pearl Jam', 'Vitalogy', 20);
    record_shop.addRecord( record2 )
    // var record3 = new Record(3, 'Pearl Jam', 'No Code', 25);
    // record_shop.addRecord( record3 )
    // var record4 = new Record(4, 'Deftones', 'Koi No Yokan', 19);
    // record_shop.addRecord( record4 )
    record_shop.sellRecord(record1)
    assert.equal(1982, record_shop.cash);
    assert.deepEqual([{'id': 2, 'artist': 'Pearl Jam', 'title': 'Vitalogy', 'price': 20}], record_shop.inventory);
  })

  it( 'should be able to remove a record from inventory', function(){
    var record1 = new Record(1, 'Portishead', 'Dummy', 18);
    record_shop.addRecord( record1 )
    var record2 = new Record(2, 'Pearl Jam', 'Vitalogy', 20);
    record_shop.addRecord( record2 )
    record_shop.removeFromInventory( 1 )
    assert.deepEqual([{'id': 2, 'artist': 'Pearl Jam', 'title': 'Vitalogy', 'price': 20}], record_shop.inventory);
   })

  it( 'should be able to return the total of the stock value', function() {
    var record1 = new Record(1, 'Portishead', 'Dummy', 18);
    record_shop.addRecord( record1 )
    var record2 = new Record(2, 'Pearl Jam', 'Vitalogy', 20);
    record_shop.addRecord( record2 )
    assert.equal(38, record_shop.totalStock());
  })

  it( 'should be able to report on the stores finacial situation', function() {
    var record1 = new Record(1, 'Portishead', 'Dummy', 18);
    record_shop.addRecord( record1 )
    var record2 = new Record(2, 'Pearl Jam', 'Vitalogy', 20);
    record_shop.addRecord( record2 )
    assert.equal('Cash Stock Total 2000382038', record_shop.finances());
  })
  

})
