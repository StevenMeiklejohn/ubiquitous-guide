var name = 'Keith';

var printName = function() {
    console.log('My name is ' + name );
}

printName();




score = 5;

var result = function() {
    var score = 3;
    return score;
}

console.log(result());



var suspectOne = 'Jay';
var suspectTwo = 'Val';
var suspectThree = 'Keith';
var suspectFour = 'Rick';

var allSuspects = function() {
    var suspectThree = 'Harvey'
    console.log('Suspects include: ' + suspectOne + ', ' + suspectTwo + ', ' + suspectThree + ', ' + suspectFour)
}

allSuspects();
console.log( 'Suspect three is:' + suspectThree )





var detective = {
        name : 'Ace Ventura',
        pet : 'monkey'
    }

var printName = function(detective) {
    return detective.name
}

var detectiveInfo = function() {
    detective['name'] = 'Poirot'
    return printName(detective);
}

console.log(detectiveInfo());






var murderer = 'rick';

var outerFunction = function(){
    var murderer = 'marc';

    var innerFunction = function(){
        murderer = 'valerie';
    }

    innerFunction();
}

outerFunction();
console.log('the murderer is ', murderer);