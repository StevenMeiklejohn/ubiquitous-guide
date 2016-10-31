var _= require('lodash');

var Bank = function(name){

this.name = name;
this.accounts = [];
}

Bank.prototype = {
  add: function(account) {
    this.accounts.push(account);
  },
  find: function(name) {
    for (var account of this.accounts) {
      if (account.name === name) {
        return account;
      }
    }
  },
  findLargest: function() {
    var result = _.orderBy(this.accounts, 'value', 'desc')[0];
    return result;
  },
  total: function() {
    total = 0;
    for (account of this.accounts) {
      total += account.value;
    } 
    return total;
  },
  average: function() {
    return this.total() / this.accounts.length
  },
  // largestByType: function(type) {
  //   var sortedAccounts = [];
  //   for (var account of this.accounts)  {
  //     if (account.type === type) {
  //       sortedAccounts.push(account);
  //     }
  //   }
  //   var total = 0;
  //  for (var account of sortedAccounts) {
  //   total += account.value;
  //  }
  //   return total;
  // }

  largestByType: function(type) {
    var businessAccountTotal = 0;
    var personalAccountTotal = 0;
    for (var account of this.accounts)  {
      if (account.type === 'business') {
        businessAccountTotal += account.value;
        accountTotal = businessAccountTotal;
       }
      else
      {
        personalAccountTotal += account.value ;
        accountTotal = personalAccountTotal;
      }
      return accountTotal;
}
}
}
module.exports = Bank;