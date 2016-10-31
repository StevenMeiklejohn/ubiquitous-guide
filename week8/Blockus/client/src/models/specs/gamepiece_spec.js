var assert = require('chai').assert;
var GamePiece = require('../gamepiece.js');

describe('GamePiece', function() {
    beforeEach(function(){
        var rel = [
            [2],
            [2],
            [2],
            [2,3],
            []
        ];
        piece = new GamePiece(rel);
    });

    it('Is set up correctly', function() {

        var theArray = [
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,1,0],
            [0,0,0,0,0]
        ];
        var pieceArray = piece.array;
        assert.deepEqual(theArray, piece.array);
    });

    it('Knows its corners', function() {

        var corners = [
            [7, 11],
            [7, 9],
            [12, 9],
            [12, 12],
            [10, 12]
        ];
        var pieceCorners = piece.corners([10, 10]);
        assert.deepEqual(corners, pieceCorners);
    });

    it('Knows its flat edges', function() {

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
        var pieceFlats = piece.flats([10, 10]);
        assert.deepEqual(flats, pieceFlats);
    });

    it('Knows where its at', function() {

        var covered = [
            [8,10],
            [9,10],
            [10,10],
            [11,10],
            [11,11]
        ];

        var pieceCovered = piece.covered([10,10]);
        assert.deepEqual(covered, pieceCovered);
    });


    it('Can rotate', function(){
        var rotated = [
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,1,1,1,1],
            [0,1,0,0,0],
            [0,0,0,0,0]
        ];
        piece.rotate();
        assert.deepEqual(rotated, piece.array);
    });

    it('Can flip', function(){
        var flipped = [
            [0,0,0,0,0],
            [0,0,1,1,0],
            [0,0,1,0,0],
            [0,0,1,0,0],
            [0,0,1,0,0]
        ];
        piece.flip();
        assert.deepEqual(flipped, piece.array);
    });


    it('Can get new relative', function(){
        var startRel = piece.relative;
        var newRel = piece.getRel();
        assert.deepEqual(startRel, newRel);
    });



});
