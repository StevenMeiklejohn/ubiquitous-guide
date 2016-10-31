var CountryList = function(url){
  this.countries = [];
  this.onUpdate = null;
  this.url = url
}

CountryList.prototype = {
  populate: function(){
    var request = new XMLHttpRequest();
    request.open("GET", this.url);
    request.onload = function() {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            this.countries = countries;
            this.onUpdate(countries);
        }
    }.bind(this);
    request.send(null);
  },
  addCountry: function(country){
    this.countries.push(country);
    this.onUpdate(this.countries);
    //persist
    var request = new XMLHttpRequest();
    request.open("POST", this.url);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function(){
      if(request.status === 200){
      }
    }
    request.send( JSON.stringify( {country: country} ) );
  }
}
module.exports = CountryList;
