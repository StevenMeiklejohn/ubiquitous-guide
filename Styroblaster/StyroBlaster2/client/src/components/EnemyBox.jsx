var React = require('react');

var EnemyBox = React.createClass({

    ship:null,
    shipX:null,
    shipY:null,
    oldShipX: null,
    oldShipY: null,
    // back:null,
    // oldBack: null,



    componentDidMount: function() {
      // Add keyboard listener.
      window.addEventListener('keydown', this.whatKey, true);
      this.drawAsteroids();
    },





      GameLoop: function(){
        console.log("GameLoop called");
        // Play the game until the until the game is over.
        setInterval(this.doGameLoop, 16);

      },

 


      collideTest: function() {

        // Collision detection. Get a clip from the screen.
        var clipWidth = 20;
        var clipDepth = 20;
        var clipLength = clipWidth * clipDepth;
        // alert(clipLength);
        var clipOffset = 5;
        var whatColor = this.ctx.getImageData(this.shipX + clipOffset, this.shipY + clipOffset, clipWidth, clipDepth);

        // Loop through the clip and see if you find red or blue. 
        for (var i = 0; i < clipLength * 4; i += 4) {
          if (whatColor.data[i] == 255) {
            alert("red");
            break;
          }
          if (whatColor.data[i + 2] == 255) {
            alert("blue");
            break;
          }
        }
      },



      drawAsteroids: function() {
        console.log("drawAsteroids called");
        this.ctx = this.getDOMNode().getContext('2d');
        console.log(this.ctx);
        // Draw asteroids.
        for (var i = 0; i <= 20; i++) {
          // Get random positions for asteroids.
          var a = Math.floor(Math.random() * 799);
          var b = Math.floor(Math.random() * 499);

          // Make the asteroids red
          this.ctx.fillStyle = "#FF0000";

          // Keep the asteroids far enough away from
          // the beginning or end.
          if (a > 40 && b > 40 && a < 860 && b < 460) {

            // Draw an individual asteroid.
            this.ctx.beginPath();
            this.ctx.arc(a, b, 10, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
          } else--i;
         }

        // Draw blue base.
        this.ctx.fillStyle = "#0000FF";
        this.ctx.beginPath();
        this.ctx.rect(270, 270, 30, 30);
        this.ctx.closePath();
        this.ctx.fill();
      },



    
    render: function() {
      var style = {
        position: "absolute",
        top: "200px",
        left: "50px"
      };
      return (<canvas id="background" width={900} height={500} style={style}/>);
    }
})

module.exports = EnemyBox;



