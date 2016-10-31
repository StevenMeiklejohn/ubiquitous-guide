/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var User = __webpack_require__(7);
	
	window.onload = function(e) {
	
	    var content = document.getElementById('load_in_content');
	    loadPage('login.html', content, createLoginScreen);
	
	};
	
	var loadPage = function(url, element, callback) {
	    var request = new XMLHttpRequest();
	    request.onload = function() {
	        if (request.status === 200) {
	            element.innerHTML = request.responseText;
	            callback();
	        }
	    };
	    request.open("GET", url);
	    request.send(null);
	};
	
	var createLoginScreen = function() {
	    var button = document.getElementById('play_button');
	    button.addEventListener('click', function(e) {
	        var blue = document.getElementById('blue_user').value;
	        var yellow = document.getElementById('yellow_user').value;
	        var red = document.getElementById('red_user').value;
	        var green = document.getElementById('green_user').value;
	        var users = [];
	        users = [blue, yellow, red, green];
	        for (var i = 0; i < users.length; i++) {
	            if (users[i] === '') {
	                users[i] = 'Player ' + (i + 1);
	            }
	        }
	        loadPage('gameboard.html', document.getElementById('load_in_content'), function() {
	            createGameBoard(users);
	        });
	    });
	    document.getElementById('load_button').addEventListener('click', function(e) {
	        var logNumber = document.getElementById('gameid_input').value;
	        loadPage('gameboard.html', document.getElementById('load_in_content'), function() {
	            createGameBoard(null, parseInt(logNumber));
	        });
	    });
	};
	
	var createGameBoard = function(users, logNumber) {
	    var canvas = document.getElementById('gameboard');
	    var selectCanvas = document.getElementById('selectpanel');
	    var game = null;
	    if (logNumber){
	        game = new Game([], canvas, 600, selectCanvas);
	        game.redraw();
	        game.loadLog(parseInt(logNumber));
	    } else {
	        game = new Game(users, canvas, 600, selectCanvas);
	    }
	    game.redraw();
	
	    selectCanvas.addEventListener('click', function(e) {
	        game.userSelectPiece(e);
	    });
	
	    canvas.addEventListener('click', function(e) {
	        game.placePiece(e);
	    });
	    canvas.addEventListener('mousemove', function(e) {
	        game.onHover(e);
	    });
	    window.addEventListener('keyup', function(e) {
	        if (e.keyCode === 82) {
	            game.rotatePiece();
	        } else if (e.keyCode === 70) {
	            game.flipPiece();
	        } else if (e.keyCode === 83) {
	            game.saveLog();
	        }
	    });
	
	    document.getElementById('skip_button').addEventListener('click', function(e) {
	        game.skipTurn();
	    });
	    document.getElementById('save_button').addEventListener('click', function(e) {
	        game.saveLog();
	    });
	    document.getElementById('rotate_button').addEventListener('click', function(e) {
	        game.rotatePiece();
	    });
	    document.getElementById('flip_button').addEventListener('click', function(e) {
	        game.flipPiece();
	    });
	
	
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var GameBoard = __webpack_require__(2);
	var RenderEngine = __webpack_require__(3);
	var SelectRenderEngine = __webpack_require__(8);
	var PresetPieces = __webpack_require__(4);
	var GamePiece = __webpack_require__(5);
	var User = __webpack_require__(7);
	var Log = __webpack_require__(9);
	
	var Game = function(users, canvasElement, canvasWidth, selectCanvasElement, debug) {
	    this.users = [];
	    this.currentUser = 0;
	    this.board = new GameBoard();
	    if (!debug) {
	        this.render = new RenderEngine(canvasElement, canvasWidth);
	        this.selectRenderEngine = new SelectRenderEngine(selectCanvasElement, 600, 140);
	    }
	    this.log = new Log();
	
	    this.playing = true;
	    this.logPlaying = false;
	    this.uID = parseInt(Math.random() * 10000);
	
	    this.createUsers(users);
	    this.assignPieces();
	    this.logStartGame();
	};
	
	Game.prototype = {
	
	    logStartGame: function() {
	        this.log.setGameID(this.uID);
	        for (var i = 0; i < this.users.length; i++) {
	            this.log.addData('username', this.users[i].name);
	        }
	    },
	    createUsers: function(users) {
	        for (var i = 0; i < users.length; i++) {
	            this.createUser(users[i]);
	        }
	    },
	    createUser: function(user) {
	        var colour = null;
	        switch (this.users.length) {
	            case 0:
	                colour = "Blue";
	                break;
	            case 1:
	                colour = "Yellow";
	                break;
	            case 2:
	                colour = "Red";
	                break;
	            case 3:
	                colour = "Green";
	                break;
	        }
	        this.users.push(new User(user, colour));
	        this.assignPieces();
	    },
	    assignPieces: function() {
	        for (var user of this.users) {
	            user.pieces = new PresetPieces().generatePieces();
	        }
	    },
	    placePiece: function(e, pieceRel) {
	        if (this.playing) {
	
	            var cPos = null;
	            if(!this.logPlaying) {
	                cPos = this.render.getMousePos(e);
	            } else {
	                cPos = e;
	            }
	            var curUser = this.users[this.currentUser];
	            var curPiece = null;
	            if (pieceRel) {
	                curPiece = new GamePiece(pieceRel);
	            } else {
	                curPiece = curUser.getSelectedPiece();
	            }
	            if (this.board.placePiece([cPos.y, cPos.x], curPiece, curUser.colourCode())) {
	                new Audio('metal_off_switch.mp3').play();
	                curUser.removeSelectedPiece();
	                this.render.redraw(this.board.boardArray);
	                this.nextPlayer();
	                if (!this.logPlaying) {
	                    this.log.addData('place', {pos:cPos, rel:curPiece.relative});
	                }
	            } else {
	                new Audio('single_oil_can.mp3').play();
	            }
	        }
	        this.displayScoreBoard();
	    },
	    nextPlayer: function() {
	        if (this.checkPlayersPlaying()) {
	            this.currentUser++;
	            if (this.currentUser >= this.users.length) {
	                this.currentUser = 0;
	            }
	            if (!this.checkPlayerPlaying(this.currentUser)) {
	                this.nextPlayer();
	            }
	            var currUser = this.currUser();
	            this.selectRenderEngine.redraw(currUser.pieces, currUser.colourCode());
	        } else {
	            this.playing = false;
	            this.render.redraw(this.board.boardArray);
	            var winners = this.findWinner();
	            var winnerString = '';
	            if (winners.length === 1) {
	                winnerString = winners[0].name + ' is the winner - congratulations ' + winners[0].name + '!';
	            } else if (winners.length === 2) {
	                winnerString = 'The game is tied; ' + winners[0].name + ' and ' + winners[1].name + ' are the winners - congratulations!';
	            } else if (winners.length === 3) {
	                winnerString = 'The game is tied; ' + winners[0].name + ', ' + winners[1].name + ' and ' + winners[2].name + ' have won - congratulations!';
	            } else {
	                winnerString = 'The game is tied; you are all winners! (or losers depending on how you look at it)';
	            }
	            alert(winnerString);
	            window.location = "";
	        }
	    },
	    findWinner: function() {
	        var userObjects = [];
	        for (var i = 0; i < this.users.length; i++) {
	            userObjects.push({
	                name: this.users[i].name,
	                score: this.board[this.users[i].colourCode()]
	            });
	        }
	        userObjects.sort(function(a,b) {
	            if (a.score > b.score) {
	                return 1;
	            }
	            if (a.score < b.score) {
	                return -1;
	            }
	            return 0;
	        });
	        var firstWinner = userObjects[3];
	        var winners = [];
	        userObjects.splice(3,1);
	        for (var user of userObjects) {
	            if (user.score === firstWinner.score) {
	                winners.push(user);
	            }
	        }
	        winners.push(firstWinner);
	        return winners;
	    },
	    checkPlayerPlaying: function(index) {
	        return this.users[index].playing;
	    },
	    checkPlayersPlaying: function() {
	        var count = 0;
	        for (var i = 0; i < this.users.length; i++) {
	            if (!this.checkPlayerPlaying(i)) {
	                count++;
	            }
	        }
	        if (count < this.users.length) {
	            return true;
	        }
	        return false;
	    },
	    currUser: function() {
	        return this.users[this.currentUser];
	    },
	    onHover: function(e) {
	        if (this.playing) {
	            var curUser = this.currUser();
	            if (curUser.getSelectedPiece()) {
	                this.render.redraw(this.board.boardArray, e, curUser.colourCode(), curUser.getSelectedPiece().relative);
	            }
	        }
	    },
	    rotatePiece: function() {
	        if (this.playing) {
	            this.currUser().rotatePiece();
	        }
	    },
	    flipPiece: function() {
	        if (this.playing) {
	            this.currUser().flipPiece();
	        }
	    },
	    redraw: function() {
	        this.render.redraw(this.board.boardArray);
	        var currUser = this.currUser();
	        if (currUser) {
	            this.selectRenderEngine.redraw(currUser.pieces, currUser.colourCode());
	        }
	        this.displayScoreBoard();
	    },
	    skipTurn: function() {
	        if (this.playing) {
	            this.currUser().endPlay();
	            this.nextPlayer();
	            if (!this.logPlaying) {
	                this.log.addData('skip', null);
	            }
	        }
	    },
	    saveLog: function() {
	        this.log.saveData();
	    },
	    loadLog: function(uid) {
	        this.uID = uid;
	        this.log.setGameID(uid);
	        this.log.loadData(this.playFromLog, this);
	    },
	    playFromLog: function(logData, context) {
	        context.log.setData(logData.data);
	        context.users = [];
	        context.logPlaying = true;
	        context.playThrough(context);
	    },
	    playThrough: function(context) {
	        var data = context.log.grabData();
	        if (data) {
	            context.makeLogMove(data.action, data.options, context);
	            setTimeout(function() {
	                context.playThrough(context);
	            }, 500);
	        } else {
	            context.logPlaying = false;
	        }
	    },
	    makeLogMove: function(action, options, game) {
	        switch (action) {
	            case 'place':
	                game.placePiece(options.pos, options.rel);
	                break;
	            case 'skip':
	                game.skipTurn();
	                break;
	            case 'username':
	                game.createUser(options);
	                break;
	        }
	    },
	    userSelectPiece: function(e) {
	        var index = this.selectRenderEngine.getClickBox(this.selectRenderEngine.getMousePos(e));
	        var currentUser = this.currUser();
	        currentUser.selectPiece(index);
	        new Audio("double_down_click.mp3").play();
	    },
	    displayScoreBoard: function() {
	
	        var users = this.users;
	        if (users.length > 0) {
	            var currUser = this.currentUser;
	            var blue = document.getElementById("blue_player");
	            var yellow = document.getElementById("yellow_player");
	            var red = document.getElementById("red_player");
	            var green = document.getElementById("green_player");
	            var blue_score = document.getElementById('blue_score');
	            var yellow_score = document.getElementById('yellow_score');
	            var red_score = document.getElementById('red_score');
	            var green_score = document.getElementById('green_score');
	            var gameNumber = document.getElementById('game_number');
	
	            blue.innerText = users[0].name + ": ";
	            yellow.innerText = users[1].name + ": ";
	            red.innerText = users[2].name + ": ";
	            green.innerText = users[3].name + ": ";
	
	            blue_score.innerText = this.board[this.users[0].colourCode()];
	            yellow_score.innerText = this.board[this.users[1].colourCode()];
	            red_score.innerText = this.board[this.users[2].colourCode()];
	            green_score.innerText = this.board[this.users[3].colourCode()];
	
	            gameNumber.style.color = 'white';
	            gameNumber.innerText = "Game ID: " + this.uID;
	        }
	
	    }
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	var RenderEngine = function(element, heightWidth) {
	    this.canvas = element;
	    this.canvas.height = heightWidth;
	    this.canvas.width = heightWidth;
	    this.context = this.canvas.getContext('2d');
	    this.scale = heightWidth / 20;
	};
	
	RenderEngine.prototype = {
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
	                return {light: '#F62217', dark: '#800517'};//red;light coral, ruby
	            case 'G':
	                return {light: '#4CC417', dark: '#437C17'};//green
	            case 'B':
	                return {light: '#488AC7', dark: '#1F45FC'};//blue; blue eyes, orchid
	            case 'Y':
	                return {light: '#FFFF00', dark: '#C68E17'};//yellow; rubberduck, caramel
	            default:
	                return {light: '#FFFFFF', dark: '#E5E4E2'};
	        }
	    }
	};
	
	module.exports = RenderEngine;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var GamePiece = __webpack_require__(5);
	
	var PresetPieces = function() {
	    this.rels = [
	        [[ ], [ ], [2], [ ], [ ]],
	        [[ ], [ ], [2,3], [ ], [ ]],
	        [[ ], [ ], [1,2], [2], [ ]],
	        [[ ], [ ], [1,2,3], [ ], [ ]],
	        [[ ], [2,3], [2,3], [ ], [ ]],
	        [[ ], [2], [1,2,3], [ ], [ ]],
	        [[ ], [ ], [1,2,3,4], [ ], [ ]],
	        [[ ], [3], [1,2,3], [ ], [ ]],
	        [[ ], [2,3], [1,2], [ ], [ ]],
	        [[ ], [1], [1,2,3,4], [ ], [ ]],
	        [[ ], [2], [2], [1,2,3 ], [ ]],
	        [[2], [2], [2,3,4], [ ], [ ]],
	        [[ ], [ ], [2,3,4], [1,2 ], [ ]],
	        [[ ], [3], [1,2,3], [1], [ ]],
	        [[2], [2], [2], [2], [2]],
	        [[ ], [2], [2,3], [2,3], [ ]],
	        [[ ], [2,3], [1,2], [1], [ ]],
	        [[ ], [2,3], [2], [2,3], [ ]],
	        [[ ], [2,3], [1,2], [2], [ ]],
	        [[ ], [2], [1,2,3], [2], [ ]],
	        [[ ], [2], [1,2,3,4], [ ], [ ]]
	    ];
	};
	
	PresetPieces.prototype = {
	    generatePieces: function() {
	        var pieces = [];
	        for (var i = 0; i < this.rels.length; i++) {
	            pieces.push(new GamePiece(this.rels[i]));
	        }
	        return pieces;
	    }
	};
	
	module.exports = PresetPieces;
	
	// ONE           = [[ ],
	//                  [ ],
	//                  [2],
	//                  [ ],
	//                  [ ]];
	//
	// TWO           = [[ ],
	//                 [ ],
	//                 [2,3],
	//                 [ ],
	//                 [ ]];
	//
	// THREE         = [[ ],
	//                  [ ],
	//                  [1,2],
	//                  [ 2],
	//                  [ ]];
	//
	// FOUR            = [[ ],
	//                   [ ],
	//                   [1,2,3],
	//                   [ ],
	//                   [ ]];
	//
	// FIVE          = [[ ],
	//                  [ 2,3],
	//                  [2,3],
	//                  [ ],
	//                  [ ]];
	//
	// SIX          = [[ ],
	//                 [ 2],
	//                 [1,2,3],
	//                 [ ],
	//                 [ ]]
	//
	// SEVEN        = [[ ],
	//                 [ ],
	//                 [1,2,3,4],
	//                 [ ],
	//                 [ ]];
	//
	// EIGHT        = [[ ],
	//                 [ 3],
	//                 [1,2,3],
	//                 [ ],
	//                 [ ]]
	//
	// NINE         = [[ ],
	//                 [ 2,3],
	//                 [1,2],
	//                 [ ],
	//                 [ ]]
	//
	// TEN          = [[ ],
	//                 [ 1],
	//                 [1,2,3,4],
	//                 [ ],
	//                 [ ]]
	//
	// ELEVEN        = [[ ],
	//                 [ 2],
	//                 [2],
	//                 [1,2,3 ],
	//                 [ ]]
	//
	// TWELVE       = [[2 ],
	//                 [ 2],
	//                 [2,3,4],
	//                 [ ],
	//                 [ ]]
	//
	// THIRTEEN     = [[ ],
	//                 [ ],
	//                 [2,3,4],
	//                 [1,2 ],
	//                 [ ]]
	//
	// FOURTEEN     = [[ ],
	//                 [ 3],
	//                 [1,2,3],
	//                 [ 1],
	//                 [ ]]
	//
	// FIFTEEN      = [[ 2],
	//                 [ 2],
	//                 [2],
	//                 [ 2],
	//                 [ 2]]
	//
	// SIXTEEN      = [[ ],
	//                 [ 2],
	//                 [2,3],
	//                 [ 2,3],
	//                 [ ]]
	//
	// SEVENTEEN    = [[ ],
	//                 [ 2,3],
	//                 [1,2],
	//                 [ 1],
	//                 [ ]]
	//
	// EIGHTEEN     = [[ ],
	//                 [ 2,3],
	//                 [2],
	//                 [ 2,3],
	//                 [ ]]
	//
	// NINETEEN     = [[ ],
	//                 [ 2,3],
	//                 [1,2],
	//                 [ 1],
	//                 [ ]]
	//
	// TWENTY       = [[ ],
	//                 [ 2],
	//                 [1,2,3],
	//                 [ 2],
	//                 [ ]]
	//
	// TWENTY-ONE   = [[ ],
	//                 [ 2],
	//                 [1,2,3,4],
	//                 [ ],
	//                 [ ]]


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	var User = function(name, colour) {
	    this.name = name;
	    this.colour = colour;
	    this.pieces = [];
	    this.selectedPieceIndex = null;
	    this.playing = true;
	};
	
	User.prototype = {
	
	    colourCode: function() {
	        return this.colour[0].toUpperCase();
	    },
	    selectPiece: function(pieceIndex) {
	        if (this.pieces[pieceIndex]) {
	            this.selectedPieceIndex = pieceIndex;
	        }
	    },
	    getSelectedPiece: function() {
	        return this.pieces[this.selectedPieceIndex];
	    },
	    rotatePiece: function() {
	        this.pieces[this.selectedPieceIndex].rotate();
	    },
	    flipPiece: function() {
	        this.pieces[this.selectedPieceIndex].flip();
	    },
	    removeSelectedPiece: function() {
	        this.pieces.splice(this.selectedPieceIndex, 1);
	        this.selectedPieceIndex = null;
	        if (this.pieces.length === 0) {
	            this.playing = false;
	        }
	    },
	    endPlay: function() {
	        this.playing = false;
	    }
	};
	
	module.exports = User;


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map