// var api = require('marvel-api');
 
// var marvel = api.createClient({
//   publicKey: '1a11ffc2c79394bdd4e7a7b8d97c43a9'
// , privateKey: '403c5f3406be455684061d92266dea467b382bdc'
// });

// Request Url: http://gateway.marvel.com/v1/public/character Request Method: GET Params: {   "apikey": "your api key",   "ts": "a timestamp",   "hash": "your hash" } Headers: {   Accept: */* }


window.onload = function(){
  var PRIV_KEY = "403c5f3406be455684061d92266dea467b382bdc";
  var API_KEY = "1a11ffc2c79394bdd4e7a7b8d97c43a9";
  var ts = new Date().getTime();

  var pull = function(selected_name){
  var character_url = "http://gateway.marvel.com:80/v1/public/characters?name="+ selected_name +"&apikey=1a11ffc2c79394bdd4e7a7b8d97c43a9";
return character_url;
};

  // var url = "http://gateway.marvel.com:80/v1/public/character/avengers?apikey=" + API_KEY;
  var hash = md5(ts + PRIV_KEY + API_KEY);
  console.log(hash);
  character_url += "&ts="+ts+"&hash="+hash;
  var request = new XMLHttpRequest();
  var character = request.open("GET", url);
  request.onload = function(){
    if(request.status === 200){
      console.log('got the data');
      var jsonString = request.responseText;
      // console.log(jsonString);
      var character = JSON.parse(jsonString);
      console.log('loaded');
      console.log(character);
      main(character);
    }
  }
  request.send(null);
}

var md5 = function(value) {
    return CryptoJS.MD5(value).toString();
};

var main = function(character){
  // populateSelect(character);
  var selected = character.data.results;
  console.log(selected);
  // var selected = character.data.results[0].name
  var cached = localStorage.getItem('selectedComic');
  console.log(cached);

  if(cached){
    selected = JSON.parse(cached);
    document.querySelector('#character').selectedIndex = selected.index;
  }



  updateDisplay(selected);
  document.querySelector("#info").style.display = 'block';
};

var character_array = ["The Incredible Hulk", "Dr Doom", "Wolverine"]

var populateSelect = function(character_array) {
  var parent = document.querySelector("#character");
  character.forEach(function(item, index){
    item.index = index;
    var option = document.createElement("option");
    option.value = index;
    option.text = item.name;
    parent.appendChild(option);
    // console.log(option);
  });
  parent.style.display = 'block';
  parent.addEventListener('change', function(){
    var index = this.value;
    var character = character[index];
    updateDisplay(character);
    localStorage.setItem("selectedCharacter", JSON.stringify(character));
  });
};

// var updateDisplay = function(comic){
//   var tags = document.querySelectorAll("#info p");
//   tags[0].innerText = comic.name;
//   // tags[1].innerText = comic.population;
//   // tags[2].innerText = comic.capital;
// };










