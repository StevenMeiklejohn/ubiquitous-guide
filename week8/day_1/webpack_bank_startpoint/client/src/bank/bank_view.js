  var Bank = require('../bank/bank.js');
  var sampleAccounts = require('../sample.json');
  var Account = require('../bank/account.js');


  var BankView = function(bank){

  for( accountData of sampleAccounts){
    bank.addAccount( new Account(accountData));
  }

  console.log("we created a bank in the browser!", bank);

  var accountList = document.getElementById('accounts');

  var totalDisplay = document.getElementById('total');
  totalDisplay.innerText = "Total:" + bank.totalCash();

  for(account of bank.accounts){
    var accountListItem = document.createElement('li');
    accountListItem.innerText = account.owner + ": £" + account.amount;
    accountList.appendChild(accountListItem);
  }


//total amount in accounts
  var totalDisplay = document.getElementById('total');
  totalDisplay.innerText = "Total amount in all accounts:" + bank.totalCash();

// List of business accounts
  var businessList = document.getElementById('business-accounts')
  var businessAccountsArray = bank.filteredAccounts('business');

  for( account of businessAccountsArray){
    var businessAccountsListItem = document.createElement('li');
    businessList.appendChild(businessAccountsListItem);
    businessAccountsListItem.innerText = "Owner: " + account.owner + "Balance: " + account.amount;
  }

// Total in business accounts
  var totalBusinessAccountDisplay = document.getElementById('business-total');
  totalBusinessAccountDisplay.innerText = "Total amount in business accounts: " + bank.totalCash('business');

// List of personal accounts
  var personalList = document.getElementById('personal-accounts')
  var personalAccountsArray = bank.filteredAccounts('personal');

  for( account of personalAccountsArray){
    var personalAccountsListItem = document.createElement('li');
    personalList.appendChild(personalAccountsListItem);
    personalAccountsListItem.innerText = "Owner: " + account.owner + "Balance: " + account.amount;
    }

 // Total in personal accounts
   var totalPersonalAccountDisplay = document.getElementById('personal-total');
   totalPersonalAccountDisplay.innerText = "Total amount in personal accounts: " + bank.totalCash('personal');





// Listen for button click
  interestButton.style.display = 'block';
  interestButton.onclick=function(){
  bank.addInterest();
  console.log(bank.accounts);
  };

  var addInt = document.getElementById('interestButton');
  addInt.onclick = function(){
    // totalDisplay.innerText = "";
    // businessAccountsArray = "";
    // totalBusinessAccountDisplay.innerText = "";
    // personalAccountsArray = "";
    // personalAccountsListItem.innerText = "";
    // totalPersonalAccountDisplay.innerText = "";

  bank.addInterest();
  console.log(bank.accounts); 

  // window.onload();
  }

    


  };

    module.exports = BankView;

