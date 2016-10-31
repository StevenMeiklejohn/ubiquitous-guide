var React = require('react');



var GuessForm = React.createClass({


render: function() {
  var bastard = this.props.villains.map(function(villain, index){
    return <option value={index} key={index}> 
    {villain} </option>
  });
  console.log(bastard);
  return (
     <div className="GuessForm"> 
      <div id="Guess">
        <select id="GuessVillain"
        onChange={this.props.handleVillain}>
        <option id="" selected>Select</option>
        {bastard}
        </select>
      </div>
    </div>
  );
  }
});



    module.exports = GuessForm;


