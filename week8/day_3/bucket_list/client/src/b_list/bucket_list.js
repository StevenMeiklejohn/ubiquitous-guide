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