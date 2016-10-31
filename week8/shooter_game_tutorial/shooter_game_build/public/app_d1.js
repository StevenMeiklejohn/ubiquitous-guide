console.log("Shooter app file loaded");



// window.onload = function(){
//   console.log('app started');
//   // main();
//   // console.log('main invoked');

//   // Initialize the game and run it.
//   var game = new Game();
//   function init() {
//     if(game.init())


//     game.start;
//     console.log("game invoked");
//   }
// }
var game = new Game();

function init() {
  if(game.init())
    game.start();
}


var imageRepository = new function(){
    // Define images
    this.background = new Image();
    // // set image src
    // this.background.src = "bg.png";
    this.spaceship = new Image();
    this.bullet = new Image();
    this.enemy = new Image();
    this.enemyBullet = new Image();
    // Ensure all images have loaded before starting the game
    var numImages = 5;
    var numLoaded = 0;
    function imageLoaded() {
      numLoaded++;
      if (numLoaded === numImages) {
        window.init();
      }
    }
    this.background.onload = function() {
      imageLoaded();
    }
    this.spaceship.onload = function() {
      imageLoaded();
    }
    this.bullet.onload = function() {
      imageLoaded();
    }
    this.enemy.onload = function() {
      imageLoaded();
    }
    this.enemyBullet.onload = function() {
      imageLoaded();
    }
    // Set images src
    this.background.src = "bg.png";
    this.spaceship.src = "ship.png";
    this.bullet.src = "bullet.png";
    this.enemy.src = "enemy.png";
    this.enemy.src = "bullet_enemy.png";
  }



// function main(){
//   var button = document.getElementById('add-button');
//   button.onclick = handleClick;

//   var form = document.getElementById('film-form');
//   form.onsubmit = handleSubmit;

//   films.forEach( function(filmName) {
//     appendFilm( filmName );
//   })
// }



function Drawable() {
   // The drawable object has an init method which allows us to set the x and y position of the object when it is created. It also defines the the speed of the object (or how many pixels the object can move in each frame.)
  this.init = function(x, y, width, height) {
    // Default variables
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    }
  this.speed = 0;
  this.canvasWidth = 0;
  this.canvasHeight = 0;

  // Define abstract function to be implemented in child objects.

  this.draw = function(){
  };
  this.move = function(){
  };

    // Doesn't need to be defined as it is empty, its only purpose is to remind us that the object is abstract and that we shouldn't create an object from it.
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

// Creates the Bullet object which the ship fires. The bullets are drawn on the "main" canvas.
function Bullet(){
  this.alive = false;
  var self = object;
  // Is true if the bullet is currently in use.
  // Sets the bullet values.
  this.spawn = function(x, y, speed){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.alive = true;
  };
  // Uses a dirty rectangle to erase the bullet and moves it. Returns truw if the bullet moved off the screen, indicating that the bullet is ready to be cleared by the pool, otherwise draws the bullet.
  this.draw = function(){
    this.context.clearRect(this.x, this.y, this.width, this.height);
    this.y -= this.speed;
    if (this.y <= 0 - this.height){
      return true;
    }
    else {
      this.context.drawImage(imageRepository.bullet, this.x, this.y);
    }
  };
  // Resets the bullet values
  this.clear = function(){
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.alive = false;
  };
}
Bullet.prototype = new Drawable();

// Custom Pool object. Holds Bullet objects to be managed to prevent garbage collection.
function Pool(maxSize){
  // Max bullets allowed in the pool
  var size = maxSize;
  var pool = [];
  // Populates the pool array with Bullet objects
  this.init = function(){
    for (var i = 0; i < size; i++){
      // Initialize the bullet object
      var bullet = new Bullet();
      bullet.init(0,0, imageRepository.bullet.width, imageRepository.bullet.height);
      pool[i] = bullet;
    }
  };
  // Grabs the last item in the list and initializes it and pushed it to the front of the array.
  this.get = function(x, y, speed){
    if(!pool[size -1].alive){
      pool[size -1].spawn(x, y, speed);
      pool.unshift(pool.pop());
    }
  };
  // Used for the ship to be able to get two bullets at once. If only the get() function is used twice, the ship is able to fire and only have 1 bullet spawn instead of 2.
  this.getTwo = function(x1, y1, speed1, x2, y2, speed2){
    if(!pool[size - 1].alive && 
      !pool[size - 2].alive){
      this.get(x1, y1, speed1);
      this.get(x2, y2, speed2);
    }
  };
  // Draws any in use Bullets. If a bullet goes off the screen, clears it and pushes it to the front of the array.
  this.animate = function(){
    for (var i = 0; i < size; i++){
      // Only draw until we find a bullet that is not alive
      if (pool[i].alive){
        if (pool[i].draw()){
          pool[i].clear();
          pool.push((pool.splice(i,1))[0]);
        }
      }
      else
        break;
    }
  }
}


// Create the ship object that the player controls. The ship is drawn on the "ship" canvas and uses dirty rectangles to move around the screen.
function Ship(){
  this.speed = 3;
  this.bulletPool = new Pool(30);
  this.bulletPool.init();
  var fireRate = 15;
  var counter = 0;
  this.draw = function(){
    console.log('t',this);
    this.context.drawImage(imageRepository.spaceship, this.x, this.y);
  };
  this.move = function(){
    console.log("move");
    counter++;
    // Determine if the action is move action
    if (KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.down || KEY_STATUS.up){
      // The ship is moved, so erase its current image so it can be redrawn in its new location.
      this.context.clearRect(this.x, this.y, this.width, this.height);
      // Update x and y according to the direction to move and redraw the ship. Change the else if's to if statements to have diagonal movement.
      if (KEY_STATUS.left) {
        this.x -= this.speed
        if (this.x <= 0)// Keep player within the screen.
        this.x = 0;} 
      else if (KEY_STATUS.right) 
        { this.x += this.speed
            if (this.x >= this.canvasWidth - this.width)
              this.x = this.canvasWidth - this.width;
          } else if (KEY_STATUS.up) {
            this.y -= this.speed
            if (this.y <= this.canvasHeight/4*3)
              this.y = this.canvasHeight/4*3;
          } else if (KEY_STATUS.down) {
            this.y += this.speed
            if (this.y >= this.canvasHeight - this.height)
              this.y = this.canvasHeight - this.height;
          }
          // Finish by redrawing the ship
          this.draw();
        }
        if (KEY_STATUS.space && counter >= fireRate) {
          this.fire();
          counter = 0;
        }
      };
      // fires two bullets
      this.fire = function(){
        this.bulletPool.getTwo(this.x+6, this.y, 3, this.x+33, this.y, 3);
      };
    }
    Ship.prototype = new Drawable();


/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
  /*
   * Gets canvas information and context and sets up all game
   * objects.
   * Returns true if the canvas is supported and false if it
   * is not. This is to stop the animation script from constantly
   * running on older browsers.
   */
  this.init = function() {
    // Get the canvas element
    this.bgCanvas = document.getElementById('background');
    this.shipCanvas = document.getElementById('ship');
    this.mainCanvas = document.getElementById('ship');
    // Test to see if canvas is supported
    if (this.bgCanvas.getContext) {
      this.bgContext = this.bgCanvas.getContext('2d');
      this.shipContext = this.shipCanvas.getContext('2d');
      this.mainContext = this.mainCanvas.getContext('2d');

      // Initialize objects to contain their context and canvas
      // information
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;
      Ship.prototype.context = this.shipContext;
      Ship.prototype.canvasWidth = this.shipCanvas.width;
      Ship.prototype.canvasHeight = this.shipCanvas.height;
      Bullet.prototype.context = this.mainContext;
      Bullet.prototype.canvasWidth = this.mainCanvas.width;
      Bullet.prototype.canvasHeight = this.mainCanvas.height;

      // Initialize the background object
      this.background = new Background();
      this.background.init(0,0); // Set draw point to 0,0
      this.ship = new Ship();
      // Set the ship to start near the bottom middle of the canvas
      var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
      var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height*2;
      this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
                     imageRepository.spaceship.height);
      return true;
    } else {
      return false;
    };
  }


  // Start the animation loop
  this.start = function() {
    this.ship.draw();
    animate();
  };
 }



  function animate(){
    requestAnimFrame(animate);
    game.background.draw();
    game.ship.move();
    game.ship.bulletPool.animate();
  };


// The keycodes that will be mapped when a user presses a button.
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

// Creates the array to hold the KEY_CODES and sets all their values to false. Checking true/false is the quickest way to check status of a key press and which one was pressed when determining when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}

// Sets up the document to listen to ownkeyup events (fired when any key on the keyboard is released). When a key is released, it sets the appropriate direcrion to false to let us know which key it was.
document.ownkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}


  // animate();

  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();









