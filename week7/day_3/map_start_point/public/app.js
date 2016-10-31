var init = function() {
  var center = { lat: 55.9486, lng: -3.1999 }
  // create map
  new Map();
  // assign map variable name
  var map = new Map( center, 15 );
  map.addMarker( center, "1" );
  // map.addMarker( { lat: 55.953198, lng: -3.193952 }, "2" );
  // map.bindClick();
  // var locator = new GeoLocator( map );
  // locator.setMapCenter();
  map.addInfoWindow( center, "my info window!" )
  // console.log( GeoLocator);
  // console.log("map", map);
}



var GeoLocator = function( map ) {
  // pass the map to the GeoLocator(cionstructor function)
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

window.onload = init;
