var waterBottle = require('./water_bottle/water_bottle.js');

var displayVolume = function(){
  var volumeDisplay = document.getElementById('volume');
  volumeDisplay.innerText = waterBottle.volume;
}
window.onload = function(){
  console.log("App created from webpack", waterBottle.volume);


  displayVolume();

  var refillButton = document.getElementById('refill');
  var drinkButton = document.getElementById('drink');

  refillButton.onclick = function(){
    waterBottle.fill();
    displayVolume();

  }

  drinkButton.onclick = function(){
    waterBottle.drink();
    displayVolume();

  }
}