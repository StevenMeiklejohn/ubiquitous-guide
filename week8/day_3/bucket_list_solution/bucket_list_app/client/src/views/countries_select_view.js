var CountrySelectView = function(selectElement){
  this.selectElement = selectElement;
  this.onChange = undefined;
  this.countries = [];
  this.selectElement.addEventListener('change', function (e) {
      var target = e.target
      var index = target.selectedIndex;
      var country = this.countries[index];
      this.onChange(country);
  }.bind(this), false);
}

CountrySelectView.prototype = {
  render:function(countries){
    this.selectElement.innerHTML = "";
    this.countries = countries;
    this.countries.forEach(function(country, index){
      country.index = index;
      this.addOption(country, index);
    }.bind(this));
  },
  addOption:function(country, index){
    var option = document.createElement("option");
    option.value = index;
    option.text = country.name;
    this.selectElement.appendChild(option);
  },
  setSelectedIndex:function(index){
    this.selectElement.selectedIndex = index;
  }
}

module.exports = CountrySelectView
