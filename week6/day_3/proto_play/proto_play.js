
// var wisePerson = {
//   wisdom: function() {
//     console.log("Commit often");
//   }
// }

// // myPerson inherits meathods etc from wisePerson

// var myPerson = Object.create(wisePerson);
// myPerson.walk = function(){
//   console.log( 'left, right, left, right')
// }

// myPerson.wisdom();



var wisePerson = {
  wisdom: function() {
    console.log("Commit often");
  }
}

// myPerson inherits meathods etc from wisePerson

var myPerson = Object.create(wisePerson);
myPerson.walk = function(){
  console.log( 'left, right, left, right')
}

var Fish = function( name, colour){
  this.name = name;
  this.colour = colour;
  this.swim = function(){
    console.log("swimming");
  }
}

Fish.prototype = {
  swim: function(){
    console.log("swiming");
  }
}

var nemo = new Fish('Nemo', 'orange');
nemo.swim();