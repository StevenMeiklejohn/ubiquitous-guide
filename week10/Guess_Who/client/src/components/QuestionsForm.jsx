var React = require('react');
var CharactersBox = require('./CharactersBox');



var QuestionsForm = React.createClass({








render: function() {
  var array = ["Moustache", "Mask", "Hair"]
  var options = array.map(function(characteristic, index){
    return <option value={index} key={index}> {characteristic} </option>
  })
  return (
    <div className="QuestionsForm">

      <div id="VillainForm1">
        <select id="DoesVillainHave" 
        onChange={this.props.handleQuestion}>
        <option value="" selected> Select </option>
        {options}
        </select>
      </div>


    </div>
  );
}
});

    module.exports = QuestionsForm;