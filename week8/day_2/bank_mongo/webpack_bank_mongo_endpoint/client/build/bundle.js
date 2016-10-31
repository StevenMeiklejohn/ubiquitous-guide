/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Bank = __webpack_require__(1);
	var Account = __webpack_require__(2);
	var url = 'http://localhost:3000/accounts';
	
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
	
	  businessAccountList.innerHTML = ""
	  personalAccountList.innerHTML = ""
	
	  populateAccountList(businessAccountList, bank.filteredAccounts('business'))
	  populateAccountList(personalAccountList, bank.filteredAccounts('personal'))
	}
	
	window.onload = function(){
	  var bank = new Bank();
	
	  var request = new XMLHttpRequest();
	  request.open("GET", url);
	  request.onload = function(){
	    if(request.status === 200){
	      console.log('got the data');
	      console.log(request.responseText);
	      var sampleAccounts = JSON.parse(request.responseText)
	      for(account of sampleAccounts){
	        bank.addAccount(new Account(account));
	      }
	      displayBank(bank)
	    }
	  }
	  request.send(null);
	
	  var form = document.querySelector("#add-account")
	  form.onsubmit = function(e){
	    e.preventDefault();
	    var account = {
	      owner: document.querySelector("#owner").value,
	      amount: parseInt(document.querySelector("#amount").value),
	      type: document.querySelector("#type").value
	    }
	    bank.addAccount(new Account(account));
	    displayBank(bank);
	
	    //persist change
	    var request = new XMLHttpRequest();
	    request.open("POST", url);
	    request.setRequestHeader("Content-Type", "application/json");
	    request.onload = function(){
	      if(request.status === 200){
	      }
	    }
	    request.send(JSON.stringify(account));
	  }
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	  }
	}
	
	
	module.exports = Bank;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Account = function(params){
	  this.owner = params.owner;
	  this.amount = params.amount;
	  this.type = params.type;
	};
	
	module.exports = Account;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map