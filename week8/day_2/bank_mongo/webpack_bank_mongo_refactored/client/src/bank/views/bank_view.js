var BankView = function(bank){
  this.bank = bank;
}

BankView.prototype = {
  render: function(){
    var totalDisplay = document.getElementById('total');
    var businessTotalDisplay = document.getElementById('business-total');
    var personalTotalDisplay = document.getElementById('personal-total');

    totalDisplay.innerText = "Total: £" + this.bank.totalCash();
    businessTotalDisplay.innerText = "Total Business: £" + this.bank.totalCash('business');
    personalTotalDisplay.innerText = "Total Personal: £" + this.bank.totalCash('personal');

    var businessAccountList = document.getElementById('business-accounts');
    var personalAccountList = document.getElementById('personal-accounts');

    this.populateAccountList(businessAccountList, this.bank.filteredAccounts('business'))
    this.populateAccountList(personalAccountList, this.bank.filteredAccounts('personal'))
  },

  createItemForAccount:function(account){
    var accountListItem = document.createElement('li');
    accountListItem.innerText = account.owner + ": £" + account.amount;
    return accountListItem;
  },

  populateAccountList:function(listElement, accounts){
    for(account of accounts){
      listElement.appendChild(this.createItemForAccount(account));
    }
  }
}



module.exports = BankView;
