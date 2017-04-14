var React = require('react');
var QuestionsForm = require('./QuestionsForm.jsx');




var CharactersBox = React.createClass({

  render: function(){
    var characters = this.props.data;
    console.log(characters);

    var characterList = characters.map(function(character, index){
      return(
        <img 
        id={character.Name} 
        key={index}  
        index={index} 
        onClick={this.props.changeImage}
        alt=""
        src={character.src}
        width="200px"
        length="300px"
        />
        )
    }.bind(this))

    return(
      <div>
      {characterList}
      </div>
      )
  }
});


module.exports = CharactersBox;


