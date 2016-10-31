var React = require('react');
var BankBox = require('./BankBox');

var AccountBox = React.createClass({

  render: function() {
    var allAccounts = this.props.accountsType.map(function(account){
      return <div key={account.owner}>
      <p>Owner: {account.owner}</p>
      <p>Amount: £{account.amount}</p>
      </div>
    })

    return (
      <div>
      <h2>{this.props.accountsType[0].type}</h2>
      <h4>Total: £{this.props.accounts_total}</h4>
      {allAccounts}
      </div>
    );
  }

});

module.exports = AccountBox;