var React = require('react');


var BorderingCountries = React.createClass({
  render: function(){
    var borderItems = this.props.borders.map(function(border){
      return <p key={border.alpha3Code}> {border.name} </p>
    })
      return(
        <div>
          <h4>BorderingCountries:</h4>
          {borderItems}
          </div>
          )
    }
  })


module.exports = BorderingCountries;



