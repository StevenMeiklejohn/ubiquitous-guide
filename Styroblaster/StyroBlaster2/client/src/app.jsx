var React = require('react');
var ReactDOM = require('react-dom');
var GameBox = require('./components/GameBox.jsx');

  var drawBackground = function(){
  var canvas = document.getElementById("background");
  console.log(canvas);
  var ctx = canvas.getContext("2d");
  canvas.width = 900;
  canvas.height = 500;

  var velocity=100;
  console.log(velocity);
  var bgImage = new Image();
  bgImage.addEventListener('load',drawImage,false);
  bgImage.src = "http://wallpapercave.com/wp/PU5vVEd.jpg";
  // bgImage.src = "https://i.ytimg.com/vi/T40NSkd7Olc/maxresdefault.jpg";
  console.log(bgImage);
  function drawImage(time){  

          var framegap=time-lastRepaintTime;
          lastRepaintTime=time;
          var translateX=velocity*(framegap/1000);
          ctx.clearRect(0,0,canvas.width,canvas.height);
          var pattern=ctx.createPattern(bgImage,"repeat-x");
          ctx.fillStyle=pattern;
          ctx.rect(translateX,0,bgImage.width,bgImage.height);
         ctx.fill();
          ctx.translate(-translateX,0);   
      requestAnimationFrame(drawImage);
  }
  var lastRepaintTime=window.performance.now();
}

window.onload = function(){

  drawBackground();
  // ReactDOM.render(
  //   <div>
  //     <GameBox />
  //  </div>, 
  //   document.getElementById('app')

  // );
}


