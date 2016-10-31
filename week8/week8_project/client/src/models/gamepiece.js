var GamePiece = function(tiles) {
    this.relative = tiles;
    this.array = this.generateArray();
    this.setup(tiles);

};

GamePiece.prototype = {

    setup: function(input) {
        for (var array of input) {
            if (array.length > 0) {
                for (var element of array) {
                    this.changeTile(element, input.indexOf(array), 1);
                }
            }
        }
    },
    changeTile: function(x, y, value) {
        this.array[y][x] = value;
    },
    corners: function(coordinates) {
        var startY = coordinates[0] - 2;
        var startX = coordinates[1] - 2;
        var corners = [];
        for (var y = 0; y < this.array.length; y++) {
            for (var x = 0; x < this.array[y].length; x++) {

                if (this.array[y][x]) {
                    if (this.array[y + 1]) {
                        if (!this.array[y][x + 1] && !this.array[y + 1][x]) {
                            corners.push([startY + y + 1, startX + x + 1]);
                        }
                        if (!this.array[y][x - 1] && !this.array[y + 1][x]) {
                            corners.push([startY + y + 1, startX + x - 1]);
                        }
                    } else if (this.array[y + 1] === undefined) {
                        if (!this.array[y][x + 1]) {
                            corners.push([startY + y + 1, startX + x + 1]);
                        }
                        if (!this.array[y][x - 1]) {
                            corners.push([startY + y + 1, startX + x - 1]);
                        }
                    }

                    if (this.array[y - 1]) {
                        if (!this.array[y][x + 1] && !this.array[y - 1][x]) {
                            corners.push([startY + y - 1, startX + x + 1]);
                        }
                        if (!this.array[y][x - 1] && !this.array[y - 1][x]) {
                            corners.push([startY + y - 1, startX + x - 1]);
                        }
                    } else if (this.array[y -1] === undefined) {
                        if (!this.array[y][x + 1]) {
                            corners.push([startY + y - 1, startX + x + 1]);
                        }
                        if (!this.array[y][x - 1]) {
                            corners.push([startY + y - 1, startX + x - 1]);
                        }
                    }
                }
            }
        }
        return this.unique(corners);
    },

    flats: function(coordinates) {
        var startY = coordinates[0] - 2;
        var startX = coordinates[1] - 2;
        var flatsArray = [];
        for (var y = 0; y < this.array.length; y++) {
            for (var x = 0; x < this.array[y].length; x++) {

                if (this.array[y][x]) {

                      if (!this.array[y][x + 1]) {
                          flatsArray.push([startY + y, startX + x + 1]);
                      }

                      if (!this.array[y][x - 1]) {
                          flatsArray.push([startY + y, startX + x - 1]);
                      }

                      if (this.array[y + 1]){
                        if (!this.array[y + 1][x] || this.array[y + 1][x] === undefined) {
                          flatsArray.push([startY + y + 1, startX + x]);
                        }
                      }else{
                        flatsArray.push([startY + y + 1, startX + x]);
                      }

                      if (this.array[y - 1]){
                        if (!this.array[y - 1][x] || this.array[y - 1][x] === undefined) {

                          flatsArray.push([startY + y - 1, startX + x]);
                        }
                      }else{
                        flatsArray.push([startY + y - 1, startX + x]);
                      }
                }
            }
        }
        return this.unique(flatsArray);
    },

    covered: function(coordinates) {
        var startY = coordinates[0] - 2;
        var startX = coordinates[1] - 2;
        coveredSquares = [];
        for (var y = 0; y < this.array.length; y++) {
            for (var x = 0; x < this.array[y].length; x++) {
                if (this.array[y][x]) {
                    coveredSquares.push([startY + y, startX + x]);
                }
            }
        }
        return coveredSquares;
    },

    unique: function(array){
       var uniqueArray = [];
       for (var item of array){
          if (!this.isItemInArray(uniqueArray, item)){
            uniqueArray.push(item);
          }
       }
       return uniqueArray;
    },

  isItemInArray: function(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][0] == item[0] && array[i][1] == item[1]) {
                return true;
            }
        }
        return false;
    },
    rotate: function() {
        var rotatedArray = this.generateArray();
        for (var x = 4; x > -1; x--) {
            for (var y = 0; y < 5; y++) {
                var newY = y - 4;
                if (newY < 0) {
                    newY = newY * -1;
                }
                rotatedArray[x][y] = this.array[newY][x];
            }
        }
        this.array = rotatedArray;
        this.getRel();
    },
    flip: function() { // NOTE: do we want just vertical flip - do we want horizontal flip also
        this.array = this.array.reverse();
        this.getRel();
    }, // NOTE: horizontal flip could be done by rotate twice and then flip ( no new functions required)
    getRel: function() {
        var rel = [[],[],[],[],[]];
        for (var y = 0; y < this.array.length; y++) {
            for (var x = 0; x < this.array[y].length; x++) {
                if (this.array[y][x]) {
                    rel[y].push(x);
                }
            }
        }
        this.relative = rel;
        return this.relative;
    },
    generateArray: function(){
        var array = new Array(5);
        for (var i = 0; i < 5; i++) {
            array[i] = new Array(5);
            for (var j = 0; j < 5; j++) {
                array[i][j] = 0;
            }
        }
        return array;
    }

};
module.exports = GamePiece;
