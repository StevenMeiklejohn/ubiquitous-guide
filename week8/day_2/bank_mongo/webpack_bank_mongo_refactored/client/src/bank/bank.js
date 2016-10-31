var Account = require('./account.js');
var Bank = function(){
  this.accounts = [];
  this.onFetchSuccess = null;
}

Bank.prototype = {
  addAccount: function(account){
    this.accounts.push(account);
  },
  findAccountByOwnerName:function(ownerName){
    var foundAccount = null;
    for (account of this.accounts) {
      if(account.owner === ownerName){
        foundAccount = account;
      }
    }
    return foundAccount;
  },
  filteredAccounts: function(type){
    if(!type) return this.accounts
    var filteredAccounts = [];
    for (account of this.accounts) {
      if(type === account.type)
        filteredAccounts.push(account);
    }
    return filteredAccounts;
  },
  totalCash:function(type){
    var total = 0;
    for (account of this.filteredAccounts(type)) {
      total += account.amount;
    }
    return total;
  },
  accountAverage:function(){
    return this.totalCash()/this.accounts.length;
  },
  fetchAccounts:function(){
    var url = 'http://localhost:3000/accounts';
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function(){
      if(request.status === 200){
        var sampleAccounts = JSON.parse(request.responseText)
        for(account of sampleAccounts){
          this.addAccount(new Account(account));
        }
        this.onFetchSuccess();
      }
    }.bind(this);
    request.send(null);
  }
}


module.exports = Bank;
