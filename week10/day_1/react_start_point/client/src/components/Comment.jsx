var React = require('react');

var Comment = React.createClass({

handleDelete: function() {
  console.log('delete pressed', this.props.author);
  this.props.onCommentDelete(this.props.id);
},

render: function(){
  return(
<div>
  <h2> { this.props.author } </h2>
  { this.props.text }
  <button onClick={this.handleDelete}> X </button>
</div>
    );
}

})

module.exports = Comment;



// Adding delete button.
// Create button (onclick)
// create log out 
