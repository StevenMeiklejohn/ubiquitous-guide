window.onload = function() {
  console.log('hello');
  var url = "https://restcountries.eu/rest/v1";
  var request = new XMLHttpRequest();
  request.open("GET", url);

  request.onload = function() {
    if(request.status === 200){
      var jsonString = request.responseText;
      console.log(jsonString);
      console.log(jsonString);
      var countries = JSON.parse(jsonString);
      console.log(countries);
      main(countries);
    }
  }
  request.send(null);
}


var main = function(countries) {
  populateSelect(countries);
  var selected = countries[0];
  var cached = localStorage.getItem('selectedCountry');

  if(cached){
    selected = JSON.parse(cached);
    document.querySelector('#countries').selectedIndex = selected.index;
  }

  updateDisplay(selected);
  document.querySelector("#info").style.display = 'block';
}



var populateSelect = function(countries) {
  var parent = document.querySelector("#countries");
  countries.forEach(function(item, index){
    item.index = index;
    var option = document.createElement("option");
    option.value = index;
    option.text = item.name;
    parent.appendChild(option);
  });
  parent.style.display = 'block';
  parent.addEventListener('change', function(){
    var index = this.value;
    var country = countries[index];
    updateDisplay(country);
    localStorage.setItem("selectedCountry", JSON.stringify(country));
  })
  // parent.onchange = fucntion()
}

var updateDisplay = function(country){
  var tags = document.querySelectorAll("#info p");
  tags[0].innerText = country.name;
  tags[1].innerText = country.population;
  tags[2].innerText = country.capital;
}