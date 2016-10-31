var React = require('react');

var CountriesSelector = require('./CountriesSelector.jsx');

var CountryDisplay = require('./CountryDisplay.jsx');

var CountriesBox = React.createClass({

  getInitialState: function(){
    return { countries: [], displayCountry:null }
  },

  setDisplayCountry: function(country){
    this.setState( { displayCountry: country })
  },



// This function will be called/invoked for us. We do not need to call it.
  componentDidMount:function(){
    console.log('CDM was called');
    var url = "https://restcountries.eu/rest/v1/all";
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function(){
      var data = JSON.parse( request.responseText );
      this.setState( { countries: data } );
    }.bind(this)
    request.send();
  },


  getBorderingCountries: function(){
    // do a map on the borders array for the selected country.
    var borderingCountries = this.state.displayCountry.borders.map(function(border){
      // Find the country that has the same alpha3 code as the border.
      return this.state.countries.find(function(country){
        // Return country object if country matches alpha3Code
        return country.alpha3Code === border
      })
    }.bind(this))
    return borderingCountries;
  },
  //   var borders = country.borders
  //   var countries = this.state.countries.filter(function(country, index){
  //     for (var border of borders){
  //       if (border === country.alpha2Code){
  //         return country
  //       }
  //     }
  //   })
  //   this.setState( { borderingCountries: countries } )
  // },


  render: function(){
    var displayElement = <h4> No Country Selected </h4>
    if(this.state.displayCountry){
      displayElement= <CountryDisplay country={this.state.displayCountry} 
      borderingCountries = {this.getBorderingCountries()}
      />
    }
    return(
      <div>
      <h4> Countries Box </h4>
      <CountriesSelector 
      countries={this.state.countries}
      onSelectCountry = {this.setDisplayCountry}
      />
      {displayElement} 
      </div>
      )
  }
})

module.exports = CountriesBox