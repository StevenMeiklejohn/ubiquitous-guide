var init = function() {
  var center = { lat: 55.9486, lng: -3.1999 }
  console.log('hello google maps');
  // create map
  new Map();
  // assign map id
  var map = new Map( center, 14 );
  map.addMarker( center, "1" );
  map.addMarker( { lat: 55.953198, lng: -3.193952 }, "2" );
  map.bindClick();
  console.log("map", map);
}

// Create our own constructor function
var Map = function(latLng, zoom) {
  // Make a call to the google maps API
  // Every instance of our map is equal to the googleMap property (this.googleMap)
  this.googleMap = new google.maps.Map( document.getElementById( 'map' ), {
    center: latLng,
    zoom: zoom
  });


  this.addMarker = function( latLng, label ) {
      // marker constructor function
      var marker = new google.maps.Marker( {
        position: latLng,
        map: this.googleMap,
        label: label
      })
  }

  this.bindClick = function() {
    //google.maps.event.addListener( map, eventType, callback )
    google.maps.event.addListener( this.googleMap, "click", function(event) { 
      console.log( event.latLng.lat() );
      console.log( event.latLng.lng() );
      this.addMarker( { lat: event.latLng.lat(), lng: event.latLng.lng() }, "A" );
    }.bind(this) );
  }


}

window.onload = init;