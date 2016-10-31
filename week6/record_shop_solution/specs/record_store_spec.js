var assert = require('assert');
var RecordStore = require('../record_store.js');
var Record = require('../record.js');

describe('Record Store', function() {
  it("should be Rockin' Rick's, New York, 0 inventory", function () {
    var rs = new RecordStore("Rockin' Rick's", "New York");
    assert.equal("Rockin' Rick's", rs.getName());
    assert.equal("New York", rs.getCity());
    assert.equal(rs.getRecords().length, 0);
  });
  it('should add one record to the RecordStore', function(){
    var rs = new RecordStore("Rockin' Rick's", "New York");
    var nevermind = new Record("Nirvana", "Nevermind", 9.99);
    rs.addRecord(nevermind);
    assert.equal(1, rs.getRecords().length);
    assert.equal(rs.getRecords()[0].getTitle(), "Nevermind");
  });
  it('should list Nevermind by Nirvana price:$9.99', function(){
    var rs = new RecordStore("Rockin' Rick's", "New York");
    var nevermind = new Record("Nirvana", "Nevermind", 9.99);
    var cowboys = new Record("Johnny Cash", "All My Friends Are Cowboys", 12.99);
    rs.addRecord(nevermind);
    rs.addRecord(cowboys);
    assert.equal( rs.listInventory().listing, "Nevermind by Nirvana price:$9.99\nAll My Friends Are Cowboys by Johnny Cash price:$12.99\n");
  });
  it('should return total inventory price as 22.98', function(){
    var rs = new RecordStore("Rockin' Rick's", "New York");
    var nevermind = new Record("Nirvana", "Nevermind", 9.99);
    var cowboys = new Record("Johnny Cash", "All My Friends Are Cowboys", 12.99);
    rs.addRecord(nevermind);
    rs.addRecord(cowboys);
    assert.equal(rs.listInventory().totalPrice, 22.98);
  });
  it('should remove the correct record from the records array', function(){
    var rs = new RecordStore("Rockin' Rick's", "New York");
    var nevermind = new Record("Nirvana", "Nevermind", 9.99);
    rs.addRecord(nevermind);
    assert.equal(1, rs.getRecords().length);
    soldRecord = rs.sellRecord(nevermind);
    assert.equal(0, rs.getRecords().length);
    assert.equal(soldRecord.getTitle(), "Nevermind" );
  });
  it('should be 9.99 in the bank', function(){
    var rs = new RecordStore("Rockin' Rick's", "New York");
    var nevermind = new Record("Nirvana", "Nevermind", 9.99);
    rs.addRecord(nevermind);
    rs.sellRecord(nevermind);
    assert.equal(rs.getCashInBank(), 9.99);
  });

});