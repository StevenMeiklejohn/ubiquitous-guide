var React = require('react');
var ShipBox = require('./ShipBox.jsx');
var EnemyBox = require('./EnemyBox.jsx');


var GameBox = React.createClass({

  componentDidMount: function() {
  console.log("loaded");
  },



  
 


  render: function() {
    return (
      <div className="GameBox">
        <h1>1981</h1>

      <div className="ShipBox">
      <ShipBox/>
      </div>

      </div>
      );
  }
})

module.exports = GameBox;