
// setTimeout sets a 'wait' time to wait before executing the function. IN this case, an anonymous function.

// setTimeout(function() {
//   console.log("I waited for 1 second");
// }, 1000);


// var logRed = function(){
//   console.log("It's red!");
// }

// var logNotRed = function(){
//   console.log("It's NOT red")
// }

// var redChecker = function(colour, isRed, isNotRed){
//   if(colour === "red"){isRed();
//   }
//   else
//   {
//     isNOtRed();
//   }
// }

// redChecker("red", logRed, logNotRed



var logRed = function(message){
  console.log(message);
}

var logNotRed = function(message){
  console.log(message);
}

var redChecker = function(redMessage, notRedMessage,colour, isRed, isNotRed){
  if(colour === "red"){
    isRed(redMessage);
  }
  else
  {
    isNOtRed(notRedMessage);
  }
}

redChecker("this is the red image", "This is not red message", "red", logRed, logNotRed);