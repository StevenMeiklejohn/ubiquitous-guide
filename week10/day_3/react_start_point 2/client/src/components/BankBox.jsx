var React = require('react');
var AccountBox = require('./AccountBox.jsx');
var AccountForm = require('./AccountForm.jsx');
var accounts = require('../sample_accounts.js');


var BankBox = React.createClass({

// var business = {
//   display: inline-block
// },
// var personal = {
//   display: inline-block
// },

getInitialState: function(){
  return {allAccounts: accounts}
},

getAccountsTotal: function(accounts){
  var total = 0
  for (var account of accounts){
    total += account.amount;
  }
  return total;
},

// handleSubmit: function(e){
//   console.log('button pressed');
//   // var account = {}
//   // e.preventDefault()
//   // this.props.addAccount({
//   //   owner: this.state.allAccounts.owner,
//   //   amount: this.state.allAccounts.amount,
//   //   type: this.state.allAccounts.type
//   // })
//   // this.account = {owner:'', amount:'', type:''}
//   // this.setState(account)
//   // console.log(this.state.allAccounts)
// },


getPersonalAccounts: function(){
  var personalAccounts = []
  for (var account of this.state.allAccounts){
    if (account.type === "Personal") {
      personalAccounts.push(account)
    }
  }
  return personalAccounts;
},

getBusinessAccounts: function(){
  var businessAccounts = []
  for (var account of this.state.allAccounts){
    if (account.type === "Business"){
      businessAccounts.push(account)
    }
  }
  return businessAccounts;
},

handleAccountSubmit: function(account){
  account.id = Date.now();
  var newAccounts = this.state.allAccounts.concat([account])
  this.setState( { allAccounts: newAccounts } );
},

handleAccountDelete: function(id) {
  var filteredAccounts = this.state.allAccounts.filter(
    function(comment){
      return account.id != id
    })
  this.setState( { accounts: filteredAccounts } )
},


render: function() {
  return (
      <div>
        <h2>RBS2 : The Revenge</h2>
        <h4>The Bank That Likes to Say...Damn Straight Your Home Is At Risk.</h4>
        <div className="personal">
        <AccountBox
          accounts={this.state.allAccounts} 
          accounts_total={this.getAccountsTotal( this.getBusinessAccounts() )} 
          accountsType={this.getPersonalAccounts()}
        /></div>
        <div className="business">
        <AccountBox
          accounts={this.state.allAccounts} 
          accounts_total={this.getAccountsTotal( this.getPersonalAccounts() )} 
          accountsType={this.getBusinessAccounts()}
        /></div>
        <div className="form">
        <AccountForm onAccountSubmit={ this.handleAccountSubmit }
        /></div> 
      </div>
    );
  }

});

module.exports = BankBox;