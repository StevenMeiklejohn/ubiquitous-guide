var SelectRenderEngine = function(element, height, width) {
    this.canvas = element;
    this.canvas.height = height;
    this.canvas.width = width;
    this.context = this.canvas.getContext('2d');
    this.xScale = width / 13;
    this.yScale = height / 67;
    this.selectBoard = this.generateArray();
};

SelectRenderEngine.prototype = {
    fillBox: function(x, y, colour) {
        this.context.fillStyle = colour.light;
        this.context.fillRect(x*this.xScale, y*this.yScale, this.xScale, this.yScale);
        // this.context.fillStyle = colour.dark;
        // this.context.fillRect((x*this.xScale)+3, (y*this.yScale)+3, this.xScale-6, this.yScale-6);
        // this.context.fillStyle = colour.light;
        // this.context.fillRect((x*this.xScale)+5, (y*this.yScale)+5, this.xScale-10, this.yScale-10);
    },
    fillBoard: function(board) {
        for (var y = 0; y < board.length; y++) {
            for (var x = 0; x < board[y].length; x++) {
                this.fillBox(x,y,this.getUserColour(board[y][x]));
            }
        }
    },
    getMousePos: function(e) {
        var rect = this.canvas.getBoundingClientRect();
        var tPadding = parseInt(window.getComputedStyle(this.canvas, null).getPropertyValue('padding-left'));
        var lPadding = parseInt(window.getComputedStyle(this.canvas, null).getPropertyValue('padding-top'));
        x = e.clientX - rect.left - lPadding;
        y = e.clientY - rect.top - tPadding;
        return {x: parseInt(x / this.xScale), y: parseInt(y / this.yScale)};
    },
    redraw: function(pieces, userColour) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.selectBoard = this.generateArray();
        this.placePieces(this.generateCenterCoordinates(), pieces, userColour);
        this.fillBoard(this.selectBoard);
        this.drawGrid();
    },
    generateArray: function() {
        var array = new Array(67);
        for (var i = 0; i < 67; i++) {
            array[i] = new Array(13);
            for (var j = 0; j < 13; j++) {
                array[i][j] = null;
            }
        }
        return array;
    },
    highlightBox: function(pos, userColour, piece) {
        this.context.beginPath();
        this.context.strokeStyle = this.getUserColour(userColour).light;
        this.context.lineWidth = this.scale / 5;
        var x = pos.x - 2;
        var y = pos.y - 2;
        for (var i = 0; i < piece.length; i++) {
            if (piece[i]) {
                for (var j = 0; j < piece[i].length; j++) {
                    this.drawBoxPart(x + piece[i][j], y+i, 'top');
                    this.drawBoxPart(x + piece[i][j], y+i, 'bottom');
                    this.drawBoxPart(x + piece[i][j], y+i, 'left');
                    this.drawBoxPart(x + piece[i][j], y+i, 'right');
                }
            }
        }
        this.context.stroke();
        this.context.lineWidth = 1;
    },
    drawBoxPart: function(x, y, box) {
        x *= this.scale;
        y *= this.scale;
        switch (box) {
            case 'top':
                this.context.moveTo(x + 1, y + 1);
                this.context.lineTo(x + (this.scale-1), y + 1);
                break;
            case 'left':
                this.context.moveTo(x + 1, y + 1);
                this.context.lineTo(x + 1, y + (this.scale-1));
                break;
            case 'right':
                this.context.moveTo(x + (this.scale-1), y + 1);
                this.context.lineTo(x + (this.scale-1), y + (this.scale-1));
                break;
            case 'bottom':
                this.context.moveTo(x + 1, y + (this.scale-1));
                this.context.lineTo(x + (this.scale-1), y + (this.scale-1));
                break;
        }
    },
    drawGrid: function() {
        this.context.beginPath();
        var x = 0;
        while ( x <= this.canvas.width ) {
            this.context.strokeStyle = "#837E7C";
            this.context.moveTo(x,0);
            this.context.lineTo(x, this.canvas.height);

            x += this.xScale;
        }
        var y = 0;
        while ( y <= this.canvas.height ) {
            this.context.strokeStyle = "#000000";
            this.context.moveTo(0,y);
            this.context.lineTo(this.canvas.width, y);
            y += this.yScale;
        }
        this.context.stroke();
    },
    getUserColour: function(colour) {
        switch (colour) {
            case 'R':
                return {light: '#F62217', dark: '#800517'};
            case 'G':
                return {light: '#4CC417', dark: '#437C17'};
            case 'B':
                return {light: '#488AC7', dark: '#1F45FC'};
            case 'Y':
                return {light: '#FFFF00', dark: '#C68E17'};
            default:
                return {light: '#FFFFFF', dark: '#E5E4E2'};
        }
    },
    fill: function(coordinates, colourString) {
        this.selectBoard[coordinates[0]][coordinates[1]] = colourString;
    },
    placePieces: function(coordinates, pieces, userColour) {
        for (var i = 0; i < pieces.length; i++) {
            this.placePiece(coordinates[i], pieces[i], userColour);
        }
    },
    placePiece: function(coordinates, piece, userColour){
        for (var pair of piece.covered(coordinates)) {
            this.fill(pair, userColour);
        }
    },
    generateCenterCoordinates: function() {

        var array = [];

        for (var i = 0; i < 61; i+=6) {
            array.push([(i+3), 3]);
            array.push([(i+3), 9]);
        }

        array.pop();
        return array;
    },
    getClickBox: function(pos) {
        var index = 0;
        for (var x = 0; x < 11; x++) {
            if (pos.x > 0 && pos.x < 6) {
                if (pos.y > (6*x)+1 && pos.y < (6*x)+5) {
                    return index;
                }
            }
            index++;
            if (pos.x > 6 && pos.x < 12) {
                if (pos.y > (6*x)+1 && pos.y < (6*x)+5) {
                    return index;
                }
            }
            index++;
        }
    }
};

module.exports = SelectRenderEngine;
