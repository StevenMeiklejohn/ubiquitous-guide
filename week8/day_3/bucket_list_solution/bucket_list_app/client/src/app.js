var CountriesSelectView = require('./views/countries_select_view');
var BucketListView = require('./views/bucket_list_view');
var CountryDetailView = require('./views/country_detailed_view');
var CountrySelectView = require('./views/countries_select_view');

var CountryList = require('./models/country_list');


window.onload = function () {
    //setup views
    var countriesSelectView = new CountriesSelectView(document.querySelector('#countries'));
    var countryDetailView = new CountryDetailView(document.querySelector('#info'));
    var bucketListView = new BucketListView(document.querySelector('#bucket-list'));

    //link change on select to update detail view and persist last country
    countriesSelectView.onChange = function(country){
      countryDetailView.render(country);
    }

    //setup country list model
    var world = new CountryList('https://restcountries.eu/rest/v1');
    var bucketList = new CountryList('http://localhost:3000/bucketList');

    //update views on data update
    world.onUpdate = function(countries){
      countriesSelectView.render(countries);
    };

    bucketList.onUpdate = function(countries){
      bucketListView.render(countries);
    };

    countryDetailView.onAdd = function(country){
      bucketList.addCountry(country)
    }

    //get data from server
    world.populate();
    bucketList.populate();

};
