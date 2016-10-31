

var SolarSystem = function( SSName, starName ) {
  this.SSName = SSName;
  this.starName = starName;
  this.planets = [];

  this.addPlanet = function( planet ) {
    this.planets.push( planet );
  };
}






module.exports = SolarSystem;