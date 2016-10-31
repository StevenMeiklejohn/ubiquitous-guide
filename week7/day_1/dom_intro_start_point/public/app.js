



window.onload = function(){
  var element = document.getElementById("main-text");
  console.log(element);



  var button = document.getElementById("button-input");
  button.onclick = changeBackground;

  var form = document.getElementById("input-form");
  form.onsubmit = handleSubmit;


}

var changeBackground = function() {
  var text = document.getElementById("text-input");
  document.body.style.backgroundColor = text.value;
}

var handleSubmit = function(event) {
  event.preventDefault();
  changeBackground();
}














// console.log("This is JavaScript calling!");

// window.onload = function(){
//   console.log("The DOM has loaded successfully.");
//   var element = document.getElementById('main-text');
//   console.log('element', element);
// }

// console.log(window.onload);

// window.onload = function(){
//   console.log('onload triggered')
//   main();
// }

// function main(){
//   console.log("main function invoked. main-text element id assigned");
//   var element = document.getElementById('main-text');
//   logElement(element);
// }

// function logElement(str){
//   console.log("logElement invoked")
//   console.log(str);
// }

