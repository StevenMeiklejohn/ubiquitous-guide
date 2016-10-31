var Bank = require('./bank/bank.js');
var Account = require('./bank/account.js');


var createItemForAccount = function(account){
  var accountListItem = document.createElement('li');
  accountListItem.innerText = account.owner + ": £" + account.amount;
  return accountListItem;
}

var populateAccountList = function(listElement, accounts){
  for(account of accounts){
    listElement.appendChild(createItemForAccount(account));
  }
}

var displayBank = function(bank){
  var totalDisplay = document.getElementById('total');
  var businessTotalDisplay = document.getElementById('business-total');
  var personalTotalDisplay = document.getElementById('personal-total');

  totalDisplay.innerText = "Total: £" + bank.totalCash();
  businessTotalDisplay.innerText = "Total Business: £" + bank.totalCash('business');
  personalTotalDisplay.innerText = "Total Personal: £" + bank.totalCash('personal');

  var businessAccountList = document.getElementById('business-accounts');
  var personalAccountList = document.getElementById('personal-accounts');
  businessAccountList.innerHTML = "";
  personalAccountList.innerHTML = "";
  populateAccountList(businessAccountList, bank.filteredAccounts('business'))
  populateAccountList(personalAccountList, bank.filteredAccounts('personal'))
}


var url = "http://localHost:3000/accounts";
window.onload = function(){
  var bank = new Bank();
// make ajax request.
  var request = new XMLHttpRequest();
  request.open("GET", url);
  // check request is successfull
  request.onload = function(){
    if(request.status === 200){
      console.log("Got the data");
      var sampleAccounts = JSON.parse(request.responseText);


  for(account of sampleAccounts){
    bank.addAccount(new Account(account));
  }
  displayBank(bank);
    };

  }
  request.send(null);

  var form = document.getElementById('add-account');
  form.onsubmit = function(e){
      e.preventDefault();
      var account = {
        owner: document.querySelector("#owner").value,
        amount: parseFloat(document.querySelector("#amount").value),
        type: document.querySelector("#type").value
      }
      console.log(account);
      bank.addAccount(new Account(account));
      displayBank(bank);

      // make new request
      var request = new XMLHttpRequest();
      request.open("POST", url);
      // define data being sent.
      request.setRequestHeader("Content-Type", "application/json");
      request.onload = function(){
        console.log("added a new account");
      }
      request.send(JSON.stringify(account));
  }

}
