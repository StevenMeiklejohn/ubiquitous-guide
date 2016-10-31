var geocoder = new google.maps.Geocoder;

window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    request.open("GET", url);

    console.log(request.onload);

    request.onload = function () {
        if (request.status === 200) {
            console.log('got the data');
            var jsonString = request.responseText
            var countries = JSON.parse(jsonString);
            main(countries);//got the data start the chain of events
            console.log('countries');
        }
    }
    request.send(null);
};

var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    console.log(selected);
    if(cached)
    {
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }
    updateDisplay(selected);
    document.querySelector('#info').style.display = 'block';
}

var populateSelect = function (countries) {
    var parent = document.querySelector('#countries');
    var index = 0;
    countries.forEach(function (item) {
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
        index++;
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.options[this.selectedIndex].value;
        var country = countries[index];
        updateDisplay(country);
        country.index = index;
        localStorage.setItem("selectedCountry",JSON.stringify(country));
    });
}

var updateDisplay = function (country) {
    var tags = document.querySelectorAll('#info p')
    tags[0].innerText = country.name;
    tags[1].innerText = country.population;
    tags[2].innerText = country.capital;
    var latlng = {lat: country.latlng[0], lng: country.latlng[1]};
    addMap(country, latlng)
}

var addMap = function(country,latlng){
  var map = new google.maps.Map(document.getElementById('map'), {
    center: latlng,
    zoom: 5
  })
  addMarker(country, latlng, map);
}

var addMarker = function(country, latlng, map){
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
  });
  addInfoWindow(country, map, marker);
}

var addInfoWindow = function(country, map, marker){
  marker.addListener('click', function() {
    var infowindow = new google.maps.InfoWindow({
      content: "<h4>"+ country.name +"</h4> <p>" + country.subregion + "</p>"
    });
    infowindow.open(map, marker);
  });
}
