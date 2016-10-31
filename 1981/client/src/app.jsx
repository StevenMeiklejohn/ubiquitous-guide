var React = require('react');
var ReactDOM = require('react-dom');
var ReactCanvas = require('react-canvas');
var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var GameBox = require('./components/GameBox.jsx');



window.onload = function(){

  ReactDOM.render(
    <div>
      <GameBox />
   </div>, 
    document.getElementById('app')

  );
}


