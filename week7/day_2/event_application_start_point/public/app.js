console.log("Film site app has loaded");

window.onload = function(){
  console.log('app started');
  main();
  console.log('main invoked');
}

var films = JSON.parse( localStorage.getItem( 'films')) || [];
// variable films = (converted to array)films from localStorage ||or|| empty array
// => First time, an empty array is returned. When the array os no longer empty the filled array is returned.
  console.log( films);



function main(){
  var button = document.getElementById('add-button');
  button.onclick = handleClick;

  var form = document.getElementById('film-form');
  form.onsubmit = handleSubmit;

  films.forEach( function(filmName) {
    appendFilm( filmName );
  })
}

var handleClick = function(){
  console.log('Woah I was got clicked');
  var textInput = document.getElementById('film-text-input');
  var filmName = textInput.value;
  console.log('film name', filmName);
  appendFilm(filmName);
  films.push( filmName );
  console.log( 'films', films );
  console.log('localStorage', localStorage);
  var f = JSON.stringify( films );
  localStorage.setItem( 'films', f );

  // var new_array = localStorage.getItem(films_array2);
  // new_array.push('filmName');
  // // var newFilms = JSON.stringify( films_array );
  // // localStorage.setItem( 'films', newFilms);

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