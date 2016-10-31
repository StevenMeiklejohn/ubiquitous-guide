var Log = function() {
      this.data = [];
      this.currentIndex = 0;
      this.gameID = null;
};

Log.prototype = {

    setGameID: function(id) {
        this.gameID = id;
    },
    addData: function(action, options) {
        this.data.push({action: action, options: options});//action = skip or place; options = rel + position
    },
    grabData: function() {
        var data = this.data[this.currentIndex];
        this.nextIndex();
        return data;
    },
    nextIndex: function() {
        this.currentIndex++;
        if (this.currentIndex === this.data.length) {
          this.currentIndex = null;
        }
    },
    saveData: function() {
        var request = new XMLHttpRequest();
        request.open('POST', 'savelog');
        request.setRequestHeader('Content-Type', 'application/json');
        var data = {game: this.gameID, data: this.data};
        request.send(JSON.stringify(data));
    },
    loadData: function(callback, context) {
        var request = new XMLHttpRequest();
        request.onload = function() {
            if (request.status === 200) {
                callback(JSON.parse(request.responseText)[0], context);
            }
        };
        request.open('POST', 'loadlog');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({game: this.gameID}));
    },
    setData: function(data) {
        this.data = data;
    }
};
module.exports = Log;
