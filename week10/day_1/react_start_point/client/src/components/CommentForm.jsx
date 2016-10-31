var React = require('react');

var CommentForm = React.createClass({
  getInitialState: function() {
      return {author:'', text:''};
     },

  handleAuthorChange: function(e){
    this.setState( { author: e.target.value })
  },

  handleTextChange: function(e){
    this.setState( {text: e.target.value })
  },

  handleSubmit: function(e){
    e.preventDefault()
    this.props.onCommentSubmit( {
      author: this.state.author,
      text: this.state.text
    })

    this.setState( {author:'', text:'' })
  },
  


  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
      <input 
      type = "text" 
      placeholder="Your Name" 
      value = {this.state.author}
      onChange = {this.handleAuthorChange}
      />
      <input 
      type = "text" 
      placeholder="Say Something"
      value= {this.state.text}
      onChange = {this.handleTextChange}
      />
      <input 
      type = "submit" 
      value="Enter Comment"
      />
      </form>
      )
  }
})

module.exports = CommentForm;

