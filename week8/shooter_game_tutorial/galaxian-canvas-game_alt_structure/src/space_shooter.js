// Define an object to hold all our images for the game so the images are only ever created once. This type of object is known as a singleton.

var imageRepository = new function(){
  // Define images
  this.background = new Image();
  // // set image src
  this.background.src = "bg.png";
}



// Creates a Drawable object which will be the base class for all drawable objects in the game. Sets up default variables that all child objects will inherit, as well as the default functions.

function Drawable() {
   // The drawable object has an init method which allows us to set the x and y position of the object when it is created. It also defines the the speed of the object (or how many pixels the object can move in each frame.)
  this.init = function(x, y) {
    // Default variables
    this.x = x;
    this.y = y;
    }
  this.speed = 0;
  this.canvasWidth = 0;
  this.canvasHeight = 0;

  // Define abstract function to be implemented in child objects.

  this.draw = function(){

    // Doesn't need to be defined as it is empty, its only purpose is to remind us that the object is abstract and that we shouldn't create an object from it.
  };
}




function Background() {
  // redefine speed of the background for panning.
  this.speed = 1;

  // Implement abstract function
  this.draw = function() {
    // pan background
    this.y += this.speed;
    this.context.drawImage(imageRepository.background, this.x, this.y);
    // Draw another image at the top edge of the first image.
    this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);
    // check if the y position has gone off the top of the screen and will reset it if it has to continue panning.
    if (this.y >= this.canvasHeight)
      this.y = 0;
  };
}
// Set background to inherit properties from Drawable
Background.prototype = new Drawable();


// Create the Game object which will hold all objects and data for the game.
function Game(){
  this.init = function() {
    // Get the canvas element
    this.bgCanvas = document.getElementById('background');
    // Test to see if canvas is supported
    if (this.bgCanvas.getContext) {
      this.bgContent = this.bgCanvas.getContext('2d');
      // Initialize objects to contain their context and canvas information
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;
      // Initialize the background object
      this.background = new Background();
      // Set draw point to 0,0
      this.background.init(0,0);
      return true;
      } else {
        return false;
      }
  };

  // Start the animation loop
  this.start = function() {
    animate();
  };
  }


  // The animation loop. Calls the requestAnimationFrame shim to optimize the game loop and draw all game objects. This must ve a global function and cannot be within an object.

  function animate(){
    requestAnimFrame( animate );
    game.background.draw();
  }

  window.requestAnimFrame = (function(){
    return window.requestAnimFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback, element){
      window.setTimeout(callback, 100 / 60);
    };
  })();

  // The animate function is the game loop and all it does is draw the background object. To animate the game, the animate function calls the requestAnimFrame shim. A game loop shouldn't be created using the window.setTimeout as it isn't optimized for 60FPS. Modern browsers have created their own highly optimized game loop functions, and this shim finds the first one that works and uses it. It will default to window.SetTimeout if nothing else works.



  // Initialize the game and run it.
  var game = new Game();
  function init() {
    if(game.init())
      game.start();
  }
