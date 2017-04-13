var React = require('react');
var QuestionsForm = require('./QuestionsForm.jsx');




var CharactersBox = React.createClass({



  render: function() {
    return (
      <div className="CharactersBox">
        <h1 id="CharactersHeader">Bastards</h1>

        <div id="Vader">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[0].src}
        id="Vader" 
        width="200px" 
        length="300px" 
        />
        </div>

        <div id="Ming">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[1].src}
        width="200px" 
        length="300px"/>
        </div>

        <div id="Skeletor">
        <img
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[2].src}
        width="200px" 
        length="300px"/>
        </div>

        <div id="Hitler">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[3].src}
        width="200px" 
        height="200px"/>
        </div>

        <div id="Stalin">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[4].src}
        width="200px" 
        height="200px"/>
        </div>

        <div id="CharacterSeparator">
        </div>

        <div id="Trump">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[5].src}
        width="200px" 
        height="200px"/>
        </div>

        <div id="Joffrey">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[6].src}
        width="200px" 
        height="200px"/>
        </div>

        <div id="DrDoom">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[7].src}
        width="200px" 
        height="200px"/>
        </div>

        <div id="Beiber">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[8].src}
        width="200px" 
        height="200px"/>
        </div>

        <div id="MummRa">
        <img 
        onClick={this.props.changeImage}
        alt ="" 
        src={this.props.data[9].src}
        width="200px" 
        height="200px"/>
        </div>



      </div>
    );
  }
});

    module.exports = CharactersBox;


    


