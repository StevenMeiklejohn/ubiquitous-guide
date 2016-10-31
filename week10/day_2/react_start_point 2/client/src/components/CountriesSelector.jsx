var React = require('react');

var CountriesSelector = React.createClass({

  getInitialState: function() {
      return { selectedIndex: null } 
  },

  handleChange: function(e){
    e.preventDefault();
    var newIndex = e.target.value;
    this.setState({selectedIndex: newIndex});
    var selectedCountry = this.props.countries[newIndex];
    this.props.onSelectCountry( selectedCountry );

  },

  render: function(){
    var options = this.props.countries.map(function(country, index){
      return <option value={index} key={country.alpha2Code}> {country.name} </option>
    });


    // var options2 = this.props.onBorderCountries.map(function(country, index){
    //   return <option value={index} key={country.alpha3Code}> {country.name} </option>
    // });



    return (
      <select value={this.state.selectedIndex} onChange={this.handleChange}>
        {options}
      </select>
      )
    }
})


module.exports = CountriesSelector




