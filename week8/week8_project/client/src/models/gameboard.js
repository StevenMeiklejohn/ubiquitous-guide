var GameBoard = function() {
    this.boardArray = this.generateBoardArray();
    this.R = 0;
    this.G = 0;
    this.B = 0;
    this.Y = 0;
};

GameBoard.prototype = {
    generateBoardArray: function(){
        var array = new Array(20);
        for (var i = 0; i < 20; i++) {
            array[i] = new Array(20);
            for (var j = 0; j < 20; j++) {
                array[i][j] = null;
            }
        }
        return array;
    },
    fill: function(coordinates, colourString) {
        this.boardArray[coordinates[0]][coordinates[1]] = colourString;
        this.updateColourCount(colourString);
    },
    inBounds: function(coordinates) {
        if (this.boardArray[coordinates[0]]) {
            if (this.boardArray[coordinates[0]][coordinates[1]] !== undefined) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    listInBounds: function(coordinatesList) {
        var inBoundsCoords = [];
        for (var coordPair of coordinatesList) {
            if (this.inBounds(coordPair)) {
                inBoundsCoords.push(coordPair);
            }
        }
        return inBoundsCoords;
    },

    isInBounds: function(coordinatesList){
        if(this.listInBounds(coordinatesList).length === coordinatesList.length){
            return true;
        } else {
            return false;
        }

    },

    updateColourCount: function(colourString) {
        this[colourString] += 1;
    },
    checkSquare: function(coordinatePair, userColour) {
        var square = this.boardArray[coordinatePair[0]][coordinatePair[1]];
        if (userColour) {
            if (square === userColour) {
                return true;
            }
        } else {
            if (!square) {
                return true;
            }
        }
        return false;
    },
    checkSquaresAvailable: function(coordinatesList) {
        for (var coordPair of coordinatesList) {
            if (!this.checkSquare(coordPair)) {
                return false;
            }
        }
        return true;
    },
    checkCorners: function (coordinatesList, userColour) {
        var foundValidCorner = false;
        for (var coordPair of coordinatesList) {
            if (this.checkSquare(coordPair, userColour)) {
                foundValidCorner = true;
            }
        }
        return foundValidCorner;
    },

    checkEdges: function( coordinatesList, userColour) {
        return !this.checkCorners(coordinatesList, userColour);
    },

    isLegal: function( coordinates, piece, userColour ){
        if (this[userColour] === 0) {

            if(!this.cornerSquare(piece.covered(coordinates))) {
                return false;
            }
        }
        if(this.isInBounds(piece.covered(coordinates))){
            if(this.checkSquaresAvailable(piece.covered(coordinates))){
                if(this.checkEdges(this.listInBounds(piece.flats(coordinates)), userColour)){
                    if(this[userColour] === 0 || this.checkCorners(this.listInBounds(piece.corners(coordinates)), userColour)){
                        return true;
                    }
                }
            }
        }
        return false;
    },

    cornerSquare: function( coordinatesList ){
        for( var item of coordinatesList ){
            if( (item[0] === 0 && item[1] === 0) || ( item[0] === 0 && item[1] === 19) || (item[0] === 19 && item[1] === 0) || (item[0] === 19 && item[1] === 19)){
                return true;
            }
        }
        return false;
    },

    placePiece: function(coordinates, piece, userColour){
        if (this.isLegal(coordinates, piece, userColour)) {
            for (var pair of piece.covered(coordinates)) {
                this.fill(pair, userColour);
            }
            return true;
        }
        return false;
    }
};

module.exports = GameBoard;
