var React = require('react');

var BackgroundBox = React.createClass({
  

    componentDidMount: function() {
      this.makeShip();

    },

    // componentDidUpdate: function() {
    //   var context = this.getDOMNode().getContext('2d');
    //   context.clearRect(0, 0, 900, 500);
     
    // },



    // scrollBackground: function(){

      //         var framegap=time-lastRepaintTime;
      //         lastRepaintTime=time;
      //         var translateX=velocity*(framegap/1000);
      //         ctx.clearRect(0,0,canvas.width,canvas.height);
      //         var pattern=ctx.createPattern(bgImage,"repeat-x");
      //         ctx.fillStyle=pattern;
      //         ctx.rect(translateX,0,bgImage.width,bgImage.height);
      //        ctx.fill();
      //         ctx.translate(-translateX,0);   
      //     requestAnimationFrame(drawImage);
      // }
      // var lastRepaintTime=window.performance.now();

///////////////////////
    //     var img = document.getElementById("stars");
    //     var context = this.getDOMNode().getContext('2d');
    //     var vx=0;
    //     context.clearRect(0, 0, 900, 500);
    //     var pattern=context.createPattern(img,"repeat-x");
    //     context.fillStyle=pattern;
    //     context.rect(vx,0, 900, 500);
    //     context.fill();

    // },


    // drawBackground: function(){
    //     //Get canvas element
    //     var ctx = this.getDOMNode().getContext('2d');
    //     ctx.clearRect(0, 0, 900, 500);
    //     console.log(ctx);


      //     // Paint it black.
      //     ctx.fillStyle = "black";
      //     ctx.rect(0, 0, 900, 500);
      //     ctx.fill();
      //     // Paint the starfield.
      //     this.stars(ctx);
      // },

      // // Paint a random starfield.


      // stars: function(ctx) {
      //   // Draw 50 stars.
      //   for (var i = 0; i <= 50; i++) {
      //     // Get random positions for stars.
      //     var x = Math.floor(Math.random() * 900)
      //     var y = Math.floor(Math.random() * 500)

      //     // Make the stars white
      //     ctx.fillStyle = "white";

      //     // Give the ship some room.
      //     if (x < 30 || y < 30) ctx.fillStyle = "black";

      //     // Draw an individual star.
      //     ctx.beginPath();
      //     ctx.arc(x, y, 3, 0, Math.PI * 2, true);
      //     ctx.closePath();
      //     ctx.fill();
      //   }

      //   // Draw space ship.
      //   this.makeShip(ctx);
      // },

      makeShip: function() {
        //Get canvas element
        var ctx = this.getDOMNode().getContext('2d');
        ctx.clearRect(0, 0, 900, 500);
        console.log(ctx);

        // Draw saucer bottom.
        ctx.beginPath();
        ctx.moveTo(28.4, 16.9);
        ctx.bezierCurveTo(28.4, 19.7, 22.9, 22.0, 16.0, 22.0);
        ctx.bezierCurveTo(9.1, 22.0, 3.6, 19.7, 3.6, 16.9);
        ctx.bezierCurveTo(3.6, 14.1, 9.1, 11.8, 16.0, 11.8);
        ctx.bezierCurveTo(22.9, 11.8, 28.4, 14.1, 28.4, 16.9);
        ctx.closePath();
        ctx.fillStyle = "rgb(222, 103, 0)";
        ctx.fill();

        // Draw saucer top.
        ctx.beginPath();
        ctx.moveTo(22.3, 12.0);
        ctx.bezierCurveTo(22.3, 13.3, 19.4, 14.3, 15.9, 14.3);
        ctx.bezierCurveTo(12.4, 14.3, 9.6, 13.3, 9.6, 12.0);
        ctx.bezierCurveTo(9.6, 10.8, 12.4, 9.7, 15.9, 9.7);
        ctx.bezierCurveTo(19.4, 9.7, 22.3, 10.8, 22.3, 12.0);
        ctx.closePath();
        ctx.fillStyle = "rgb(51, 190, 0)";
        ctx.fill();
      },
    



    render: function() {
      var style = {
        position: "absolute",
        top: "200px",
        left: "50px"
      }
      return (<canvas id="background" width={900} height={500} style={style} />);
    }


  });





module.exports = BackgroundBox;