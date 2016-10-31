var assert = require('chai').assert;
var GameBoard = require('../gameboard.js');
var GamePiece = require('../gamepiece.js');

describe('GameBoard', function() {
    beforeEach(function(){
        var rel = [
            [2],
            [2],
            [2],
            [2,3],
            []
        ];
        piece = new GamePiece(rel);

        board = new GameBoard();

    });
    it('has a board array which is an array of twenty arrays of twenty nulls!', function() {

        assert.equal(20, board.boardArray.length);
        assert.equal(20, board.boardArray[0].length);
        assert.equal(null, board.boardArray[0][0]);
    });
    it('can colour a square when provided with a colour and coordinates', function() {

        board.fill([9,7], 'R');
        assert.equal('R', board.boardArray[9][7]);
    });
    it('can determine if a given coordinate pair falls within the bounds of its board array', function() {

        assert.equal(true, board.inBounds([10,10]));
        assert.equal(false, board.inBounds([20,20]));
    });
    it('can take a list of coordinate pairs and remove those that fall outside its bounds', function() {

        var coordsList = [[2,1], [-2,3], [-2,-3], [2,-3], [10,20], [20, 10], [20,20]];
        var coordsInBounds = board.listInBounds(coordsList);
        assert.equal(1, coordsInBounds.length);
        assert.deepEqual([[2,1]], coordsInBounds);
    });
    it('can tell when a given square is already filled', function() {

        board.fill([9,7], 'R');
        assert.equal(false, board.checkSquare([9,7]));
    });
    it('can tell when a placed piece is overlapping one or more occupied squares', function() {

        board.fill([9,7], 'R');
        var coordPairs = [
            [9,7],
            [10,10]
        ];
        assert.equal(false, board.checkSquaresAvailable(coordPairs));
    });
    it('can decide if a piece placement meets the corner requirement', function() {
        board.fill([12, 9], 'R');
        var corners = [
            [7, 11],
            [7, 9],
            [12, 9],
            [12, 12],
            [10, 12]
        ];
        assert.equal(true, board.checkCorners (corners, 'R'));
    });
    it('can decide if a piece placement meets the edge requirement', function() {

        var flats = [
            [8, 11],
            [8, 9],
            [7, 10],
            [9, 11],
            [9, 9],
            [10, 11],
            [10, 9],
            [11, 9],
            [12, 10],
            [11, 12],
            [12, 11]

        ];
        assert.equal(true, board.checkEdges(flats, 'R'));
        board.fill([12, 10], 'R');
        assert.equal(false, board.checkEdges(flats, 'R'));


    });
    it('can decide if a placement is legal', function() {
        board.fill([10,12], 'R');
        assert.equal(true, board.isLegal([10, 10], piece, 'R'));
    });
    it('can update its array if a placement is legal', function() {
        board.placePiece([2,0], piece, 'R');
        assert.equal(5, board['R']);
    });
    it('adds one to the appropriate colour count when a square is filled with a colour', function() {
        board.fill([9,7], 'R');
        assert.equal(1, board.R);
    });
    it('knows when a placed piece will occupy a corner square', function() {
        piece.flip();
        var covered = piece.covered([1, 18]);
        assert.equal(true, board.cornerSquare(covered));
    });

});
