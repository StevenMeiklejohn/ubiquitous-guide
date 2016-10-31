var _ = require('lodash');

function RecordStore(name, city){
  this.name       = name;
  this.city       = city;
  this.records    = [];
  this.cashInBank = 0;
}

RecordStore.prototype = {

  getName: function(){
    return this.name;
  },

  getCity: function(){
    return this.city;
  },

  getRecords: function(){
    return this.records;
  },

  addRecord: function(record){
    this.records.push(record);
  },

  sellRecord: function(record){
    this.records = _.without(this.records, record);

    //Add price to the balance
    this.setCashInBank(record.getPrice());
    return record;
  },

  getCashInBank: function(){
    return this.cashInBank;
  },

  setCashInBank: function(amount){
    this.cashInBank += amount;
  },

  listInventory: function(){
    var inventory = {
      listing: "",
      totalPrice: 0
    };
    var i = 0;
    for (i; i < this.records.length; i++) {
      inventory.listing += this.records[i].getTitle() + " by " + this.records[i].getArtist() + " price:$" + this.records[i].getPrice() + "\n";
      inventory.totalPrice += this.records[i].getPrice();
    };
    return inventory;
    }
}


module.exports = RecordStore;