var React = require('react');
var Comment = require('./Comment.jsx');


var CommentList = React.createClass({
  render: function(){

    var commentArray = this.props.data.map(function(comment){
      return(
        <Comment 
        author={comment.author} 
        text={comment.text} 
        key={comment.id}
        id={comment.id}
        onCommentDelete = {this.props.onCommentDelete}
        />
        )
    }.bind(this))

    return (
    <div>
      I am a comment list.
      {commentArray}
    </div>
    )
  }
})


module.exports = CommentList;