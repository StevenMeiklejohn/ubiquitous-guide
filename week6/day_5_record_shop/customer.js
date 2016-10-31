var _= require('lodash');

var Customer = function(name) {
  this.name = name;
  this.collection = [];
}

Customer.prototype = {

  name: function(){
    return this.name;
  },
  addRecord: function(record){
    this.collection.push(record);
  },
  sellRecord: function(record){
    var rec_id = record.id;
    var index;
    this.collection.some(function (elem, rec_id, i) {
        return elem.id === rec_id ? (index = i, true) : false;
        console.log(index);
    });
    this.collection.splice(index, 1);
  }

}

module.exports = Customer;

