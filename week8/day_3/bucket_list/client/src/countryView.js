var ListView = function(list){
  this.list = list;
}

ListView.prototype = {
  render: function(){

    var bucketList = document.getElementById("bucket-list");

    bucketList.innerHTML = "";

    this.populateList(bucketList);
    
    createListItem: function(country){
      var countryListItem = document.createElement("li");
      countryListItem.innerText = country.name + country.capital;
      return countryListItem;
    },

    populateList: function(listElement, countries){
      for(country of countries){
        listElement.appendChild(this.countryListItem(country));
      }
    }

  } 
}

module.exports = ListView;