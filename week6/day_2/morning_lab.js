//Section 1

//what types are these? Write your answer in a comment beside it.

1;      Integer
"cat";  String
true;   Boolean
[];     object
{};     object (hash)
1.1;    Integer
undefined; Undefined


//Section 2

// what is the truthy/falsiness values of the following
// write your answer in a comment beside it
// you can use an if to test this...
1; //true
"cat"; true
true; true
NaN; false
[]; true
{}; true
undefined; false
""; false
0; false



//Section 3

//Using examples that are different from above...

//3.1 Assign a variable that is a number
var num = 10;
//3.2 Assign a variable that is a string
var string = "Howdy!";
//3.3 Assign a variable that is a boolean
var booly = true;
//3.4 Assign a variable that is an object
var object = {
  objectType: car,
  objectColor: black,
  objectCost: lots
}


//Section 4
//4.1 Write a statement that writes "hello" to the console if it's true and "bye" if it is false

var status = true
if (status ==== true) {
  console.log( "hello" );
}
else
  console.log( "bye" );
}

// alternatively

true ? console.log( "hello" ) : console.log( "bye" );


//Section 5
var animals = ["raccoon","hedgehog","mouse","gerbil"];

//5.1. Assign the first element to a variable
var firstElement = animals.shift();


//5.2. Assign the last element to a variable
var lastElement = animals.pop()

//5.3. Assign the length of an array to a variable
var arrayLength = animals.length

//5.4. Add an item to the end of the array
animals.push('eagle')

//5.5. Add an item to the start of the array
animals.unshift('giraffe')

//5.6. Assign the index of hedgehog to a variable
var hedgehog = animals[1]



//Section 6

//6.1 Create an array of 5 vegetables
var vegetables = ["carrot", "beetroot", "potato", "leek", "turnip"]


//6.2 Loop over the array and write to the console using a "while"
var x = 0;
var vegetables = ["carrot", "beetroot", "potato", "leek", "turnip"];
while ( x < vegetables.length ) {
  console.log( "loop " + vegetable );
  x = x +1;
}

//6.3 Loop again using a "for" with a counter
for ( var i = 0; i < vegetables.length; i += 1 ) {
 console.log(vegetables[i]);
 }

//6.4 Loop again using a "for in"
var vegetables = ["carrot", "beetroot", "potato", "leek", "turnip"];
for ( var veg in vegetables ) {
  console.log( vegetables[veg] )
 }


 //Section 7
 var accounts = [
   { name: 'jay',
     amount: 125.50,
     type: 'personal'
   },
   { name: 'val',
     amount: 55125.10,
     type: 'business'
   },
   { name: 'marc',
     amount: 400.00,
     type: 'personal'
   },
   { name: 'keith',
     amount: 220.25,
     type: 'business'
   },
   { name: 'rick',
     amount: 1.00,
     type: 'personal'
   },
 ]


 //7.1 Calculate the total cash in accounts
 var totalMoney = function() {
  var total = 0
  for ( var cash in accounts ) {
  total += accounts[cash].amount
 }
  return total
}


 //7.2 Find the name of the account with the largest balance

var largestBankAcc = fucntion () {
 var largestAccount = accounts[0]

 for ( var account of accounts ) {
  if ( account.amount > largestAccount.amount ) {
    largestAccount = account
  }
}
return largestAccount
}
console.log( largestBankAccount );

  
 //7.3 Find the name of the account with the smallest balance



 //7.4 Calculate the average bank account value
var averageAmount = function() {
  return (totalMoney() / accounts)
}

 //7.5 Find the value of marcs bank account
var marcsBalance = function() {
  for ( var i = 0; i < accounts.length; i++ ){
    if( accounts[i].name === 'marc' ) {
      return accounts[i].amount
    }
  }
}

 //7.6 Find the holder of the largest bank account

 //7.7 Calculate the total cash in business accounts
 var x = 0
 for ( var i in accounts ) {
  if (accounts[i].type ==== 'business' ) {
    x+= accounts[i].amount
  }
  }
}

 //7.8 Find the largest personal account owner



 //Section 8
 //Assign a variable myPerson to a hash, giving them a name, height, favourite food and an eat method

 var myPerson = {
  name: "Steve",
  height: "not very tall",
  favourite_food: "Mexian",
}





