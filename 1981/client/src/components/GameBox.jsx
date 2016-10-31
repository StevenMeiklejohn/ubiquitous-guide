var React = require('react');
var ReactCanvas = require('react-canvas');
var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var ShipBox = require('./ShipBox.jsx');
var BackgroundBox = require('./BackgroundBox.jsx');
var EnemyBox = require('./EnemyBox.jsx');



var GameBox = React.createClass({



  componentDidMount: function() {
    console.log("gamebox loaded");
  },

  // getCanvasContext: function() {
  //   const context = this.refs.canvas.getContext('2d');
  //   console.log(context);
  //   return context;
  // },

  getImageHeight: function () {
    return Math.round(window.innerHeight / 2);
  },

  getImageStyle: function () {
    return {
      top: 0,
      left: 0,
      width: 900,
      height: 500
    };
  },

  render: function() {
    var surfaceWidth = 900;
    var surfaceHeight = 500;
    var imageStyle = this.getImageStyle();

    return (
      <div className="GameBox">
        <h1>1981</h1>

        <div className="BackgroundBox">
        <BackgroundBox/>
        getCanvasContext={this.getCanvasContext}
        </div>

       
      </div>);
  }

});

module.exports = GameBox;