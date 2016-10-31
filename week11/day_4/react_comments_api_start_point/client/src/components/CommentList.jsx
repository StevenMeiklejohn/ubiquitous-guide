var React = require('react');
var Comment = require('./Comment.jsx')
var CommentList = React.createClass({
  render: function() {

    var commentNodes = this.props.data.map(function(comment,index) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
module.exports = CommentList;
