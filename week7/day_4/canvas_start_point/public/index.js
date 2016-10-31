// setup
window.onload = function() {
  console.log( 'App started');
  // Acquire canvas (html element 'main' as specified in index.html) and call it variable = canvas
  var canvas = document.getElementById('main');
  console.log(canvas);

// Setup canvas context
  var context = canvas.getContext( '2d' );
// Specify context layer fill colour (must be before the fillRect)
  context.fillStyle = "red";
  // Setup rectangle x, y, width, height.
  // origin is top left corner of canvas
  context.fillRect( 10, 10, 50, 50);

  // Begin straight line
  context.beginPath();
  // start position of line relative to 0,0 (top left)
  context.moveTo( 100, 100 );
  // end position of line
  context.lineTo( 100, 150 );
  // create line
  context.stroke();


  // create an circle/arc
  // arc(x, y, radius, startAngle, relatice diameter to circumference, anticlockwise)
  var drawCircle = function( x, y){
    context.beginPath();
    context.arc( x, y, 50, 0, 2*Math.PI, false);
    context.stroke();
  }

  var drawRectangle = function( x, y, width, height ) {
    
  }
 


// Add an event listener
// When canvas is clicked, run function and pass in event
  canvas.onclick = function( event ) {
    //  console out
    console.log( 'clicked', event );
    // create a circle
    drawCircle( event.x, event.y );
  }



}

// 

