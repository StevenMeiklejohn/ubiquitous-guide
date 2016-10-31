// var myObject = new Object();

// myObject.shape = 'circle';
// myObject.radius - 10;

// console.log( myObject );


// ================================


// var House = function( sqFeet, bathrooms, bedrooms ) {
//   this.sqFeet = sqFeet;
//   this.bathrooms = bathrooms;
//   this.bedrooms = bedrooms;
//   this.numberOfRooms = function() {
//     return( this.bathrooms + this.bedrooms );
//   }
// }

// var house1 = new House( 1000, 3, 4 );
// var house2 = new House( 2000, 4, 5 );

// console.log( 'house1', house1 );
// console.log( 'house2', house2.numberOfRooms() );



// office constructor


var Office = function( meetingRooms, desks ) {
  this.meetingRooms = meetingRooms;
  this.desks = desks;
  this.averageDesksPerMeetingRoom = function() {
    var desks = ( this.desks / this.meetingRooms);
    return(desks);
  }
} 

var office1 = new Office( 3, 100 );
var office2 = new Office( 2, 2 );


console.log( office1.averageDesksPerMeetingRoom() )
console.log( office2.averageDesksPerMeetingRoom() )

