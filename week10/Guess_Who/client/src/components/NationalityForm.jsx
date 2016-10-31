var React = require('react');



var NationalityForm = React.createClass({



  render: function() {
    var nation = this.props.nations.map(function(country, index){
      return <option value={index} key={country}> {country} </option>
    });
    console.log(nation);
    return (
      <div className="NationalityForm">
        <div id="Nationality">
          <select id="Nationalities" onChange={this.props.handleCountry}>
          <option id="" selected>Select</option>
          {nation}
          </select>
        </div>
      </div>
      )
    }
  })

module.exports = NationalityForm;

