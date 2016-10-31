var RecordStore = require('./record_store.js');
var Record = require('./record.js');
var RecordCollector = require('./record_collector.js');

var nevermind  = new Record("Nirvana", "Nevermind", 9.99);
var cowboys    = new Record("Johnny Cash", "All My Friends Are Cowboys", 12.99);
var kindOfBlue = new Record("Miles Davis", "Kind of Blue", 15.00);

var rockinRicks = new RecordStore("Rockin' Rick's", "New York");
rockinRicks.addRecord(cowboys);
rockinRicks.addRecord(nevermind);
rockinRicks.addRecord(kindOfBlue);

console.log(rockinRicks);

console.log(rockinRicks.listInventory().listing);
console.log(rockinRicks.listInventory().totalPrice.toFixed(2));

//Record Collector
var val = new RecordCollector("Val", 100);
val.buyRecord(nevermind, rockinRicks);
val.buyRecord(kindOfBlue, rockinRicks);

val.sellRecord(kindOfBlue, rockinRicks);

console.log("Record Store: ", rockinRicks);
console.log("Record Collector:", val);