  var React = require('react');
  var ReactCanvas = require('react-canvas');

  var Surface = ReactCanvas.Surface;
  var Image = ReactCanvas.Image;
  var Text = ReactCanvas.Text;

  var BackgroundBox = React.createClass({


    componentDidMount: function() {
      console.log("Background Box loaded");
      this.getCanvasContext();
      this.getBgImage();
      this.scrollBackground();
    },

    getCanvasContext: function() {
      const context = this.refs.stars.getContext('2d');
      console.log(context);
      return context;
    },

    getBgImage: function() {
      const bgImage = this.refs.bgImage;
      console.log(bgImage);
      return bgImage;
    },

    scrollBackground: function() {
      var context=this.getCanvasContext();
      var bgImage=this.getBgImage();
      console.log(context);
      console.log(bgImage);
      drawImage;
    
        function drawImage(context, bgImage, time){  

                var framegap=time-lastRepaintTime;
                lastRepaintTime=100;
                var velocity = 100;
                var translateX=velocity*(framegap/1000);
                context.clearRect(0,0,900,500);
                var pattern=context.createPattern(bgImage,"repeat-x");
                context.fillStyle=pattern;
                context.rect(translateX,0,bgImage.width,bgImage.height);
               context.fill();
                context.translate(-translateX,0);   
            requestAnimationFrame(drawImage);
        }
        var lastRepaintTime=window.performance.now();
      },
    



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
      var surfaceWidth = '900';
      var surfaceHeight = 500;
      var imageStyle = this.getImageStyle();

      return (

        <Surface ref="stars" id="stars" width="900" height="500" left={50} top={-450}>
        <Image ref="bgImage" id="bgImage" src="http://data.whicdn.com/images/72880145/original.jpg" style={imageStyle}/>
        </Surface>

          );
        }

  });


module.exports = BackgroundBox;