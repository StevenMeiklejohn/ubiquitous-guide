var Blist  = require ("./b_list/bucket_list.js");
var Country = require("./b_list/country.js");
var ListView = require("./countryView.js");



window.onload = function() {
  console.log('hello');
  // fetchCountries();
  
  var url = "https://restcountries.eu/rest/v1";
  var request = new XMLHttpRequest();
  request.open("GET", url);

  request.onload = function() {
    if(request.status === 200){
      var jsonString = request.responseText;
      // console.log(jsonString);
      var countries = JSON.parse(jsonString);
      // console.log(countries);
      handleCountries(countries);
    }
  }
  request.send(null);

  ListView.render();
}


function handleCountries(countries){
  var dropDown = document.getElementById("drop-down");
    dropDown.onchange = function(event){
      var dropDown = event.target;
      var index = dropDown.options[dropDown.selectedIndex].value;
      // console.log(countries[index]);
      showDetails(countries[index]);
      this.fetchCountries(countries[index]);

    };

    var list = new Blist();
    var add_to_bl = document.getElementById("add_to_bl");
    add_to_bl.onclick = function(e){
      var index = dropDown.value;
      list.addCountry(countries[index]);
      // console.log(list);

        e.preventDefault();
        var country = {
          name: countries[index].name,
          capital: countries[index].capital
        }
        // console.log(country);
        List.addCountry(new Country(country));
        display(country);

        //persist change
        var request = new XMLHttpRequest();
        var url = "http://localhost:3000/countries"
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function(){
          if(request.status === 200){
          }
        }
        request.send(JSON.stringify(country));
      }
    for (var i = 0; i < countries.length; i++){
    var option = document.createElement("option");
    option.innerText = countries[i].name;
    option.value = i;
    dropDown.appendChild(option);
  }

  // fetchCountries:function(){
  //   var url = 'http://localhost:3000/countries';
  //   var request = new XMLHttpRequest();
  //   request.open("GET", url);
  //   request.onload = function(){
  //     if(request.status === 200){
  //       var dbCountries = JSON.parse(request.responseText)
  //       for(country of dbCountries){
  //         Blist.addCountry(new Country(country));
  //       }
  //       this.onFetchSuccess();
  //     }
  //   }.bind(this);
  //   request.send(null);
  //   console.log(country);
  // }

// function showDetails(country){
//   var name = document.getElementById("country-name");
//   var capital = document.getElementById("capital");
//   name.innerText = "Name: " + country.name;
//   capital.innerText = "Capital: " + country.capital;
// }
}