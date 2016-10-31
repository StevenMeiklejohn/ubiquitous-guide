var myName = "Keith";

if(myName === "Keith"){
  console.log("yo " + myName);
}

var counter = 1;

if(counter > 0){
  console.log("The counter is greater than 0");
}
else if(myCounter < 0){
  console.log("The counter is less than 0");
}
else{
  console.log("The counter is 0");
}

// A switch statement is the equivelant of case in ruby.

var pet = "cat";

switch(pet){
  case "cat":
    console.log("Soft Kitty, warm kitty, little ball of fur.");
    break;
  case "dog": 
    console.log("Who let the dogs out?");
    break;
  default:
    console.log("No pet. Sad.");
}


// Ternary
// ==========

1+1 === 2 ? console.log("yay. maths!") : console.log("no, maths is broken");
