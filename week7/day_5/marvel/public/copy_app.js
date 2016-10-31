// var api = require('marvel-api');
 
// var marvel = api.createClient({
//   publicKey: '1a11ffc2c79394bdd4e7a7b8d97c43a9'
// , privateKey: '403c5f3406be455684061d92266dea467b382bdc'
// });

Request Url: http://gateway.marvel.com/v1/public/comics Request Method: GET Params: {   "apikey": "your api key",   "ts": "a timestamp",   "hash": "your hash" } Headers: {   Accept: */* }

window.onload = function(){
  var PRIV_KEY = "403c5f3406be455684061d92266dea467b382bdc";
  var API_KEY = "1a11ffc2c79394bdd4e7a7b8d97c43a9";
  var ts = new Date().getTime();
  var url = "http://gateway.marvel.com:80/v1/public/comics/avengers?apikey=" + API_KEY;
  var hash = md5(ts + PRIV_KEY + API_KEY);
  url += "&ts="+ts+"&hash="+hash;
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function(){
    if(request.status === 200){
      console.log('got the data');
      var jsonString = request.responseText;
      console.log(jsonString);
      var comics = JSON.parse(jsonString);
      console.log('loaded');
      console.log(comics);

    }
  }
  request.send(null);
}
var md5 = function(value) {
    return CryptoJS.MD5(value).toString();
}

var main = function(characters){

};