window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);
        }
    }
    request.send();

    var center = { lat: 55.9486, lng: -3.1999 }
    // create map
    var map = new Map( center, 15 );
    map.addMarker( center, "1" );
    map.addMarker( { lat: 55.953198, lng: -3.193952 }, "2" );
    map.bindClick();
    var locator = new GeoLocator( map );
    locator.setMapCenter();
    map.addInfoWindow( center, "my info window!" )

};

var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }
    updateDisplay(selected);
    // document.querySelector('#info').style.display = 'block';
}

var populateSelect = function (countries) {
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var country = countries[index];
        updateDisplay(country);
        localStorage.setItem("selectedCountry",JSON.stringify(country));

    });
}

var updateDisplay = function (lala) {
    var tags = document.querySelectorAll('#info p');
    tags[0].innerText = lala.name;
    tags[1].innerText = lala.population;
    tags[2].innerText = lala.capital;
    console.log(lala.latlng);
}

var selectengLat = function (lala) {
    var tags = document.querySelectorAll('#info p');
    tags = lala.lnglat;
    return tags;
}

var GeoLocator = function( map ) {
  // pass the map to the GeoLocator(constructor function)
  this.map = map;
  // passed in/arguement app = a property of the map on line 4.
  this.setMapCenter = function() {
    navigator.geolocation.getCurrentPosition( function( position ) {
      var center = { lat: position.coords.latitude, lng: position.coords.longitude }
      this.map.resetCenter( center );
      this.map.addMarker( center, "M" );
    }.bind(this) );
  }
}



