var React = require('react');
var ReactDOM = require('react-dom');
var BankBox = require('./components/BankBox.jsx')

window.onload = function(){
  ReactDOM.render(
    <BankBox/>,
    document.getElementById('app')
  );
}
