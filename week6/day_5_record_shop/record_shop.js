var _= require('lodash');

var Record_Shop = function(name, city, cash) {
  this.name = name;
  this.city = city;
  this.cash = cash;
  this.inventory = [];
}

Record_Shop.prototype = {

  addRecord: function(record){
    this.inventory.push(record);
    // console.log(this.inventory);
  },
  removeFromInventory: function(rec_id){
    var index;
    record_shop.inventory.some(function (elem, rec_id, i) {
        return elem.id === rec_id ? (index = i, true) : false;
        console.log(index);
    });
    this.inventory.splice(index, 1);
    // console.log(this.inventory);
    // console.log(this.inventory[index]);
    // console.log(this.inventory[0].price);
  },
  name: function(){
    return this.name
  },
  city: function(){
    return this.name
  },
  listInventory: function(){
    // console.log(this.listInventory);
    return this.inventory
  },
  sellRecord: function(record){
    totalCash = this.cash;
    recordPrice = record.price;
    newTotal = totalCash -= recordPrice;
    this.cash = newTotal;
    var rec_id = record.id;
    var index;
    record_shop.inventory.some(function (elem, rec_id, i) {
        return elem.id === rec_id ? (index = i, true) : false;
        console.log(index);
    });
    this.inventory.splice(index, 1);
    // console.log(newTotal);
  },
  totalStock: function() {
    var valueArray = [];
    var counter = 0;
      do {
       valueArray.push(record_shop.inventory[counter].price) ; 
       counter++;
      }
      while (counter < record_shop.inventory.length);
      var total = 0;
      for(var i in valueArray) { total += valueArray[i]; }
    return total;
  },
  finances: function() {
    var valueArray = [];
    var counter = 0;
      do {
       valueArray.push(record_shop.inventory[counter].price) ; 
       counter++;
      }
      while (counter < record_shop.inventory.length);
      var stock_total = 0;
      for(var i in valueArray) { stock_total += valueArray[i]; }
      var cash_total = record_shop.cash;
      var total = cash_total + stock_total;
      var output = ("Cash Stock Total " + cash_total  + stock_total + total);
    return output;
  }


  // finances: function(){
  //   stock_value = 0;
  //   var counter = 0;
  //   do {
  //    record_shop.inventory[counter].price += stock_value ; 
  //    counter++;
  //   }
  //   while (counter < record_shop.inventory.length);
  //   console.log(stock_value);
  //   cashTotal = this.cash += stock_value;
  //   return cashTotal;
  //   console.log(cashTotal);
  // }

  //   for (var item of this.inventory) {
  //     console.log(item.price);
  //     item.price += stock_value;
  //     cashTotal = this.cash += stock_value;
  //     }
  //     console.log(stock_value)
  //     return stock_value;
  //   }

}

module.exports = Record_Shop;