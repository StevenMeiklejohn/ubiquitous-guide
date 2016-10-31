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
	var sampleAccounts = __webpack_require__(2);
	var Account = __webpack_require__(3);
	var BankView = __webpack_require__(5);
	
	
	
	window.onload = function(){
	  console.log('sample accounts', sampleAccounts);
	
	
	 var bank = new Bank();
	 // for ( accountData of sampleAccounts ){
	 //  bank.addAccount(new Account(accountData));
	 // }
	
	 var bankView = new BankView(bank);
	 // bankView.render(bank);
	
	
	
	
	
	}
	
	
	
	


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


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = [
	  { "owner": "jay",
	    "amount": 125.50,
	    "type": "personal"
	  },
	  { "owner": "val",
	    "amount": 55125.10,
	    "type": "personal"
	  },
	  { "owner": "marc",
	    "amount": 400.00,
	    "type": "personal"
	  },
	  { "owner": "keith",
	    "amount": 220.25,
	    "type": "business"
	  },
	  { "owner": "rick",
	    "amount": 1.00,
	    "type": "business"
	  },
	]


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Account = function(params){
	  this.owner = params.owner;
	  this.amount = params.amount;
	  this.type = params.type;
	};
	
	module.exports = Account;


/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	  var Bank = __webpack_require__(1);
	  var sampleAccounts = __webpack_require__(2);
	  var Account = __webpack_require__(3);
	
	
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
	


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map