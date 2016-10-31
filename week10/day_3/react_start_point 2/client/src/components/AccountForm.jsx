var React = require('react');

var AccountForm = React.createClass({

  getInitialState: function(){
    return {owner:'', amount:'', type:''}
  },

  handleOwnerChange: function(e){
    this.setState( { owner: e.target.value } )
  },

  handleAmountChange: function(e){
    this.setState( { amount: e.target.value } )
  },

  handleTypeChange: function(e){
    this.setState( { type: e.target.value } )
  },

  handleSubmit: function(e){
    e.preventDefault()
    this.props.onAccountSubmit( {
      owner: this.state.owner,
      amount: this.state.amount,
      type: this.state.type
    })
    this.setState( { owner: '', amount: '', type: '' } )
  },

  render: function() {
    return (
      <div>
        <h2> Add an Account</h2>
        <form onSubmit={this.handleSubmit}>
        <input
        type = "text"
        placeholder= "owner"
        value = {this.state.owner}
        onChange = {this.handleOwnerChange}
        />
        <input
        type = "text"
        placeholder = "amount"
        value = {this.state.amount}
        onChange = {this.handleAmountChange}
        />
        <input
        type = "text"
        placeholder = "type"
        value = {this.state.type}
        onChange = {this.handleTypeChange}
        />
        </form>
        <button onClick={this.handleSubmit}>
        Add </button>
      </div>
    );
  }

});

module.exports = AccountForm;