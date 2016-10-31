var Map = function(latLng, zoom) {
  // Make a call to the google maps API
  // Every instance of our map is equal to the googleMap property (this.googleMap)
  this.googleMap = new google.maps.Map( document.getElementById( 'map' ), {
    center: latLng,
    zoom: zoom
  });

  this.addMarker = function( latLng, label ){
    var marker = new google.maps.Marker( { position: latLng, map: this.googleMap, label: label } );
    return marker
  }

  this.addInfoWindow = function( latLng, title ) {
      var marker = this.addMarker( latLng, title );
      marker.addListener( 'click', function() {
        var infoWindow = new google.maps.InfoWindow({
          content: title
        });
        infoWindow.open(map, marker);
      })
  };


  this.bindClick = function() {
    //google.maps.event.addListener( map, eventType, callback )
    google.maps.event.addListener( this.googleMap, "click", function(event) {
      console.log( event.latLng.lat() );
      console.log( event.latLng.lng() );
      this.addMarker( { lat: event.latLng.lat(), lng: event.latLng.lng() }, "A" );
    }.bind(this) );
  };

  this.resetCenter = function(latLng) {
    this.googleMap.setCenter( latLng );
  };


  }
