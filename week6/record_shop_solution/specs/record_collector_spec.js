var assert = require('assert');
var RecordStore = require('../record_store.js');
var Record = require('../record.js');
var RecordCollector = require('../record_collector.js');

describe('Record Collector', function() {
  beforeEach(function() {
    recordCollector = new RecordCollector("Jay", 10);
    recordStore     = new RecordStore("Rockin' Rick's", "New York");
    nevermind       = new Record("Nirvana", "Nevermind", 9.99);
    cowboys         = new Record("Johnny Cash", "All My Friends Are Cowboys", 12.99);
  });

  it("should have an initial balance of 10", function() {
    assert.equal(recordCollector.getBalance(), "10");
  });

  it("should have an initial name of Jay", function() {
    assert.equal(recordCollector.getName(), "Jay");
  });

  it("should have an initial empty collection", function() {
    assert.equal(recordCollector.getCollection().length, 0);
  });

  it("should add the right record from the collection", function() {
    recordStore.addRecord(nevermind);
    recordCollector.buyRecord(nevermind, recordStore);

    assert.deepEqual(recordCollector.getCollection(), [nevermind]);
  });

  it("should remove the right record from the store", function() {
    recordStore.addRecord(nevermind);
    recordCollector.buyRecord(nevermind, recordStore);

    assert.deepEqual(recordStore.getRecords(), []);
  });

  it("should remove the right record from the collector", function() {
    recordStore.addRecord(nevermind);
    recordCollector.buyRecord(nevermind, recordStore);
    recordCollector.sellRecord(nevermind, recordStore);

    assert.deepEqual(recordCollector.getCollection(), []);
  });

  it("should add the right record to the store", function() {
    recordStore.addRecord(nevermind);
    recordCollector.buyRecord(nevermind, recordStore);
    recordCollector.sellRecord(nevermind, recordStore);

    assert.deepEqual(recordStore.getRecords(), [nevermind]);
  });

  it("should prevent the collector from buying records they can't afford", function() {
    recordStore.addRecord(cowboys);

    assert.equal(recordCollector.buyRecord(cowboys, recordStore), 10);
  });

});