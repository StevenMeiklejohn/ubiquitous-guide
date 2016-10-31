var Bank = require('./bank/bank.js');
var Account = require('./bank/account.js');
var BankView = require('./views/bank_view.js');


window.onload = function(){
  var bank = new Bank();
  var bankView = new BankView(bank);

  bank.onFetchSuccess = function(){
    bankView.render()
  }

  bank.fetchAccounts();

  var form = document.querySelector("#add-account")
  form.onsubmit = function(e){
    e.preventDefault();
    var accountData = {
      owner: document.querySelector("#owner").value,
      amount: parseFloat(document.querySelector("#amount").value),
      type: document.querySelector("#type").value
    }
    var newAccount = new Account(accountData)
    bank.addAccount(newAccount);
    bankView.render();
    //persist change
    newAccount.save();
  }
};
