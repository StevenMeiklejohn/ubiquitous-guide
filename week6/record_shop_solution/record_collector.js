function RecordCollector(name, balance){
  this.name        = name;
  this.collection  = [];
  this.balance     = balance;
}

RecordCollector.prototype = {

  getName: function(){
    return this.name;
  },

  getBalance: function(){
    return this.balance;
  },

  getCollection: function(){
    return this.collection;
  },

  buyRecord: function(record, store){
    if (record.price > this.balance) {
      console.log("The record collector doesn't have enough money to purchase this record");
      return this.balance;
    }
    this.collection.push(record);
    this.balance -= record.price; 
    store.sellRecord(record);
  },

  sellRecord: function(record, store){
    this.collection.splice(this.collection.indexOf(record), 1);
    this.balance += record.price;
    store.addRecord(record);
  }

}

module.exports = RecordCollector;