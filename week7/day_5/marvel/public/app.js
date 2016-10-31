
window.onload = function(){
  console.log('hello');
};

var get_character_data = function(){}
  var PRIV_KEY = "403c5f3406be455684061d92266dea467b382bdc";
  var API_KEY = "1a11ffc2c79394bdd4e7a7b8d97c43a9";
  var ts = new Date().getTime();

  var md5 = function(value) {
      return CryptoJS.MD5(value).toString();
  var character_url = "http://gateway.marvel.com:80/v1/public/characters?name="+ selected_name +"&apikey=1a11ffc2c79394bdd4e7a7b8d97c43a9";
  };

  var hash = md5(ts + PRIV_KEY + API_KEY);
  window.character_url += "&ts="+ts+"&hash="+hash;
  var request = new XMLHttpRequest();
  console.log(character_url);
  request.open("GET", character_url);

  request.onload = function(){
    if(request.status === 200){
      console.log('got the data');
      console.log(request.responseText);
      var jsonString = request.responseText;
      var character = JSON.parse(jsonString);
      console.log(character);
    }
  }
  request.send(null);
}


// var main = function(character){
//   populate_character_list(character_array);
//   var selected = character_array[0];
//   var cached = localStorage.getItem('selectedCharacter');
//   if(cached){
//     selected = JSON.parse(cached);
//     document.querySelector('#drop_down').selectedIndex = selected.index;
//   }
//   updateDisplay(selected);
//   document.querySelector("#info").style.display = 'block';
// }


var handleClick = function(){
  var selectBox = document.getElementById('drop-nav');
  console.log("val:",selectBox.value)
  var selected = document.getElementById('drop_nav').value;
//   var selected_i = parseInt(selected, 10);

//   var name = countries[selected_i].name;
//   countries_db.push( name );
//   console.log('selected:', typeof selected_i);
//   console.log(name);
//   displayResults_n(name);

//   var population = countries[selected_i].population;
//   console.log(population);
//   displayResults_p(population);

//   var capital = countries[selected_i].capital;
//   console.log(capital);
//   displayResults_c(capital);
// }

var populate_character_list = function(){
  ver selectBox = document.getElementById('drop-nav');
  selectBox.onchange = handleClick;
}

var get_character_data = function(){

}



// var updateDisplay = function(character){
//   var tags = document.querySelectorAll("#info p");
//   tags[0].innerText = character.name;
//   tags[1].innerText = character.bio;
//   tags[2].innerText = character.image;
// }

}
















