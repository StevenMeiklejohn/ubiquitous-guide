var Bank = require('./bank/bank.js');
var Account = require('./bank/account.js');
var sampleAccounts = require('./sample.json');
var BankView = require('./views/bank_view.js');

window.onload = function(){
  var bank = new Bank();
  for(account of sampleAccounts){
    bank.addAccount(new Account(account));
  }
  var bankView = new BankView(bank);
  bankView.render();
};
