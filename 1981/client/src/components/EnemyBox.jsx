var React = require('react');
var ReactCanvas = require('react-canvas');
var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var EnemyBox = React.createClass({









    
    render: function() {
      var style = {
        position: "absolute",
        top: "200px",
        left: "400px"
      };
      return (<canvas id="enemy" width={900} height={500} style={style}/>);
    }
})

module.exports = EnemyBox;



