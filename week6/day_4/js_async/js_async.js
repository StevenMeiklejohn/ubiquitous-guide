// console.log("This runs first");

// setTimeout(function(){
//   console.log("This runs second");

//   setTimeout(function(){
//     console.log("We're gonna need a bigger boat");
//   }, 3000);

// }, 1000);

// console.log("This runs third");

// ===================================

//Simulate coffeee shop

// Customer 1


// console.log("Customer: Can I order a latte please");

// console.log("Server: I'll hand it off to the barista");

// setTimeout(function() {
//   console.log("Your latte is ready");
// }, 4000);

// // Customer 2


// console.log("Customer: Can I order an espresso latte please");

// console.log("Server: I'll hand it off to the barista");

// setTimeout(function() {
//   console.log("Your espresso is ready");
// }, 2000);

// =====================================


function getTweetsAsync(callback){
  // go and get the tweets

  setTimeout(function(){
    var tweets = "These are the tweets you are looking for";
    callback(tweets);
  }, 2000);
}

var myTweets = null;
getTweetsAsync(function(tweets){
  myTweets = tweets;
  console.log(myTweets);
})

console.log(myTweets);




