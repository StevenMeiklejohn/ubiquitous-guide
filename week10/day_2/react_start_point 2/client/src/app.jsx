var React = require('react');
var ReactDOM = require('react-dom');
var CountriesBOX = require('./components/CountriesBox.jsx')

window.onload = function(){
  ReactDOM.render(
    <CountriesBOX/>,
    document.getElementById('app')
  );
}


