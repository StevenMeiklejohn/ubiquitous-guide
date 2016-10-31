var PreviewRenderEngine = function(height, width) {
    this.canvas = null;
    this.height = height;
    this.width = width;
    this.context = this.canvas.getContext('2d');
    this.scale = width / 20;
};

PreviewRenderEngine.prototype = {
    fillBox: function(x, y, colour) {
        this.context.fillStyle = colour.light;
        this.context.fillRect(x*this.scale, y*this.scale, this.scale, this.scale);
        this.context.fillStyle = colour.dark;
        this.context.fillRect((x*this.scale)+3, (y*this.scale)+3, this.scale-6, this.scale-6);
        this.context.fillStyle = colour.light;
        this.context.fillRect((x*this.scale)+5, (y*this.scale)+5, this.scale-10, this.scale-10);
        this.context.lineWidth = 1;
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
        return {x: parseInt(x / this.scale), y: parseInt(y / this.scale)};
    },
    redraw: function(board, mouseEvent, userColour, piece) {
        var curPos = null;
        if (mouseEvent) {
            curPos = this.getMousePos(mouseEvent);
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.fillBoard(board);
        if (curPos &&  userColour &&piece) {
            this.highlightBox(curPos, userColour, piece);
        }
        this.drawGrid();
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
        var i = 0;
        while ( i <= this.canvas.width ) {
            this.context.strokeStyle = "#837E7C";
            this.context.moveTo(i,0);
            this.context.lineTo(i, this.canvas.height);
            this.context.moveTo(0,i);
            this.context.lineTo(this.canvas.width, i);
            i = i + this.scale;
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
    }
};

module.exports = PreviewRenderEngine;
