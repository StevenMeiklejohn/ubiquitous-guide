function Record(artist, title, price){
  this.artist = artist;
  this.title  = title;
  this.price  = price;
}

Record.prototype = {
  getArtist: function(){
    return this.artist;
  },

  getTitle: function(){
    return this.title;
  },

  getPrice: function(){
    return this.price;
  }

}

module.exports = Record;