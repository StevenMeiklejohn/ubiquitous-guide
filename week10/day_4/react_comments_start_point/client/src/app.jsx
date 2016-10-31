var React = require('react');
var ReactDOM = require('react-dom');
var CommentBox = require('./components/CommentBox.jsx');

window.onload = function(){
  ReactDOM.render(
    <CommentBox url="/api/comments" />,
    document.getElementById('app')
  );
}
