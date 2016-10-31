window.onload = function(){

var url = "https://restcountries.eu/rest/v1"
var request = new XMLHttpRequest();
request.open("GET", url);
request.send(null);

request.onload = function() {
  loadCountryCharts(request.responseText);
}

new PieChart();
}



var loadCountryCharts = function(responseText){
  var countries = JSON.parse(responseText);

  var countryPopulationData =[];

  for(country of countries){
    countryPopulationData.push(
    {
      name: country.name,
      y: country.population
    }
    )
  }
new PieChart("Country Populations",countryPopulationData)

}