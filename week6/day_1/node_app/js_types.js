var a = 1;
var b = 2;
var c = 2.5;


// console.log(a+b);
// console.log(a-b);
// console.log(a*b);
// console.log(a/b);
// console.log(a%b);

var myString = "a nice string we are creating";

// console.log(myString.length());
// console.log(myString.toUpperCase());

console.log(1>2);
// returns false
console.log(2 == 2);
// returns true
console.log( 2 === "2");
// returns false (not same type).
console.log(2 !== 2);

var mySleepingBear = null;
console.log(mySleepingBear);
//  returns null.

var myUndefinedBear = undefined;
console.log(myUndefinedBear);
//  returns undefined.

console.log(typeof(myUndefinedBear));
//  returns undefined.

// assign numbers to different types
var numner =1;
number = "not a number lol";
console.log(typeof(number));
// returns string


console.log(3 + "hello");
// returns 3hello

console.log("route" + 6 + 6);
//returns route66

console.log(6 + 6 + "route");

// Truthiness and falsiness.
// ==========================

// falsiness:
// false
// 0
// undefined
// Empty String
// NUll
// NaN

(1 + 1 == 2)&&(1+1 ===4);
// returns false


(1 + 1 == 2)||(1+1 === 4);
// returns to trueß

console.log(!true);
//  returns false.

if(true) console.log("true!");
//  returns true.

if(false) console.log("true!");
//  returns false.

var a = true;
if(a) console.log("true!");
// returns true.
if(false) console.log("true!");
// returns false
if(0) console.log("true!");
//retunrds false.
if(2) console.log("2 is true!");
// true
if (undefined) console.log("uhoh undefined!");
// undefined
if(" ") console.log("Empty string!");


if(null) console.log("NUll is true????");

if(NaN) console.log("Huh?");

parseInt('2');
// works
console.log(parseInt('cat'));
// does not.

console.log(typeof(NaN));
// number


console.log(isNaN(1));
// false.


























