// setup
window.onload = function() {
  console.log( 'App started' );
  // Acquire canvas (html element 'main' as specified in index.html) and call it variable = canvas

    var mainCanvas = document.querySelector("#myCanvas");
    var mainContext = mainCanvas.getContext("2d");
     
    var canvasWidth = mainCanvas.width;
    var canvasHeight = mainCanvas.height;

    var requestAnimationFrame = window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame || 
                                window.webkitRequestAnimationFrame || 
                                window.msRequestAnimationFrame;
     

     
    
    // drawBackground();

     function drawBackground() {
        requestAnimationFrame(drawBackground);
         mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
          
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 300, 225 );
         mainContext.lineWidth = 2;
         mainContext.strokeStyle = 'orange'
         mainContext.stroke();

         // Top right Corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 300, -45 );
         mainContext.stroke();

         //inner top right corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 300, 0  );
         mainContext.stroke();

         //center right corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 300, 60 );
         mainContext.stroke();

         //inner bottom right corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 300, 125 );
         mainContext.stroke();

         //Bottom right corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 300, 225 );
         mainContext.stroke();

         //Inner Bottom right corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 300, 175 );
         mainContext.stroke();


         //Left lines!
         //Top left corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 0, -45 );
         mainContext.stroke();

         //inner top left corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 0, 0 );
         mainContext.stroke();

         //center left corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 0, 60 );
         mainContext.stroke();

         //inner bottom left corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 0, 125 );
         mainContext.stroke();

         //Bottom left corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 0, 225 );
         mainContext.stroke();

         //Inner Bottom left corner
         mainContext.beginPath();
         mainContext.moveTo( 150, 90 );
         mainContext.lineTo( 0, 180 );
         mainContext.stroke();



         mainContext.strokeRect( 117, 60, 66, 60);
         setInterval(function(){mainContext.strokeRect( 102, 45, 96, 90); }, 3000);
         setInterval(function(){mainContext.strokeRect( 87, 30, 126, 120); }, 4000);
         
         setInterval(function(){mainContext.strokeRect( 72, 15, 156, 150); }, 5000);
         setInterval(function(){mainContext.strokeRect( 50, 0, 200, 180); }, 6000);
     }
     drawBackground();



     //   function square1() {
     //   requestAnimationFrame(drawBackground);
     //   mainContext.strokeRect( 117, 60, 66, 60);
     //   requestAnimationFrame(square1);
     // };

     //  setTimeout(requestAnimationFrame(square2), 2000);
  

     //   function square2() {
     //    requestAnimationFrame(drawBackground);
     //   mainContext.strokeRect( 102, 45, 96, 90);
     //   setTimeout(requestAnimationFrame(square3), 2000); 
     // };

     // function square3() {
     //  // requestAnimationFrame(drawBackground);
     //   mainContext.strokeRect( 87, 30, 126, 120); 
     //   setTimeout(requestAnimationFrame(square4), 2000);
     // };

     // function square4() {
     //  // requestAnimationFrame(drawBackground);
     //   mainContext.strokeRect( 72, 15, 156, 150);
     //   setTimeout(requestAnimationFrame(square5), 2000);
     // };

     // function square5() {
     //  // requestAnimationFrame(drawBackground);
     //   mainContext.strokeRect( 50, 0, 200, 180);
     //  // setTimeout(requestAnimationFrame(drawBackground), 2000);
     // };

     // drawBackground();

}

     