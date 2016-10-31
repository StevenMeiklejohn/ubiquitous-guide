var React = require('react');

var Counter = React.createClass({
  getInitialState: function(){
    return { count: 0 }
  },

  incrementCount: function(){
    console.log('button pressed');
    this.setState({
      count: this.state.count + this.props.multiple
    });
  },

  decrementCount: function(){
    console.log('button pressed');
    this.setState({
      count: this.state.count - this.props.multiple
    });
  },







  render: function(){
    return(
      <div>
      <h1> { this.props.title } </h1>
      <p> The current count is {this.state.count} </p> 
      <h4> Multiple is { this.props.multiple }</h4>
      <button onClick={this.incrementCount}>Increment</button>
      <button onClick={this.decrementCount}>Decrement</button>
      </div>
      );
  }
});

module.exports = Counter;