/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Blist  = __webpack_require__ (1);
	var Country = __webpack_require__(2);
	var ListView = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./countryView.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	
	
	window.onload = function() {
	  console.log('hello');
	  // fetchCountries();
	  
	  var url = "https://restcountries.eu/rest/v1";
	  var request = new XMLHttpRequest();
	  request.open("GET", url);
	
	  request.onload = function() {
	    if(request.status === 200){
	      var jsonString = request.responseText;
	      // console.log(jsonString);
	      var countries = JSON.parse(jsonString);
	      // console.log(countries);
	      handleCountries(countries);
	    }
	  }
	  request.send(null);
	
	  ListView.render();
	}
	
	
	function handleCountries(countries){
	  var dropDown = document.getElementById("drop-down");
	    dropDown.onchange = function(event){
	      var dropDown = event.target;
	      var index = dropDown.options[dropDown.selectedIndex].value;
	      // console.log(countries[index]);
	      showDetails(countries[index]);
	      this.fetchCountries(countries[index]);
	
	    };
	
	    var list = new Blist();
	    var add_to_bl = document.getElementById("add_to_bl");
	    add_to_bl.onclick = function(e){
	      var index = dropDown.value;
	      list.addCountry(countries[index]);
	      // console.log(list);
	
	        e.preventDefault();
	        var country = {
	          name: countries[index].name,
	          capital: countries[index].capital
	        }
	        // console.log(country);
	        List.addCountry(new Country(country));
	        display(country);
	
	        //persist change
	        var request = new XMLHttpRequest();
	        var url = "http://localhost:3000/countries"
	        request.open("POST", url);
	        request.setRequestHeader("Content-Type", "application/json");
	        request.onload = function(){
	          if(request.status === 200){
	          }
	        }
	        request.send(JSON.stringify(country));
	      }
	    for (var i = 0; i < countries.length; i++){
	    var option = document.createElement("option");
	    option.innerText = countries[i].name;
	    option.value = i;
	    dropDown.appendChild(option);
	  }
	
	  // fetchCountries:function(){
	  //   var url = 'http://localhost:3000/countries';
	  //   var request = new XMLHttpRequest();
	  //   request.open("GET", url);
	  //   request.onload = function(){
	  //     if(request.status === 200){
	  //       var dbCountries = JSON.parse(request.responseText)
	  //       for(country of dbCountries){
	  //         Blist.addCountry(new Country(country));
	  //       }
	  //       this.onFetchSuccess();
	  //     }
	  //   }.bind(this);
	  //   request.send(null);
	  //   console.log(country);
	  // }
	
	// function showDetails(country){
	//   var name = document.getElementById("country-name");
	//   var capital = document.getElementById("capital");
	//   name.innerText = "Name: " + country.name;
	//   capital.innerText = "Capital: " + country.capital;
	// }
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	var Blist = function(){
	  this.list = [];
	}
	
	Blist.prototype = {
	  addCountry: function(country){
	    this.list.push(country);
	  },
	
	  // show_bucket_list =function(){
	
	  // }
	}
	
	module.exports = Blist;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var Country = function(params){
	  this.name = params.name;
	  this.capital = params.capital;
	};
	
	
	module.exports = Country;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map