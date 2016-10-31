var Bank = function(){
  this.accounts = [];
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

  addInterest:function(){
    updated_with_interest =[];
    for (account of this.accounts){
      account.amount = (account.amount*1.1).toFixed(2);
      updated_with_interest.push(account.amount);
      return updated_with_interest;
  }
}



}


module.exports = Bank;
