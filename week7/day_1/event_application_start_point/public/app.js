console.log("Film site app has loaded");

window.onload = function(){
  console.log('app started');
  main();
  console.log('main invoked');
}

function main(){
  var button = document.getElementById('add-button');
  button.onclick = handleClick;

  var form = document.getElementById('film-form');
  form.onsubmit = handleSubmit;
}

var handleClick = function(){
  console.log('Woah I was got clicked');
  var textInput = document.getElementById('film-text-input');
  var filmName = textInput.value;
  console.log('film name', filmName);

  appendFilm(filmName);
}

var appendFilm = function(filmName){
  var li = document.createElement('li');
  li.innerText = filmName;
  var ul = document.getElementById('film-list');
  ul.appendChild(li);
} 

var handleSubmit = function(event){
  event.preventDefault();
  handleClick();
}