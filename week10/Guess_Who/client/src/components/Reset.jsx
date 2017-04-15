var React = require('react');



var Reset= React.createClass({



  render: function() {

    return (
      <div className="Reset">
        <div id="Reset">
          <button className="button" onClick={this.props.handleReset}>New Game
          </button>
        </div>
      </div>
      )
    }
  })

module.exports = Reset;

