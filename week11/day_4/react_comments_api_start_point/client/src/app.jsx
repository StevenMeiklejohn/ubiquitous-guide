var React = require('react');
var ReactDOM = require('react-dom');
var CommentBox = require('./components/CommentBox.jsx');

window.onload = function(){

  ReactDOM.render(
    <CommentBox url="http://localhost:5000/api/comments"/>,
    document.getElementById('app')
  );

}


