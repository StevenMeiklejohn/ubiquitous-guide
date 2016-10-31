var React = require('react');
var CommentList = require('./CommentList.jsx');
var CommentForm = require('./CommentForm.jsx');


var sampleData =[
  {id:1, author:"Keith", text:"Boom! Boom! Boom!"},
  {id:2, author:"Rick", text:"Cool!"},
  {id:3, author:"Kat", text:"How dowdy"},
];

var CommentBox = React.createClass({
  getInitialState: function() {
      return {data: sampleData}
  },

handleCommentSubmit: function(comment){
  comment.id = Date.now();
  var newComments = this.state.data.concat([comment])
  this.setState( { data: newComments });
  },

handleCommentDelete: function(id) {
  var filteredComments = this.state.data.filter(function(comment){
    return comment.id != id
  })
  this.setState( { data: filteredComments } )
},

selectComment: function(){
  return (
    <div class="dropdown">
      <button onclick="myFunction()" class="dropbtn">Dropdown</button>
      <div id="myDropdown" class="dropdown-content">
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>
    </div>
    );
},



  render: function(){
    return (
    <div>
      I am a comment box.
      <CommentList data={ this.state.data } onCommentDelete={this.handleCommentDelete} />
      <CommentForm onCommentSubmit={ this.handleCommentSubmit }/>
    </div>
    );
  }
});


module.exports = CommentBox;