var GameBoard = require('./gameboard.js');
var RenderEngine = require('./renderengine.js');
var SelectRenderEngine = require('./selectrenderengine.js');
var PresetPieces = require('./pieceRels.js');
var GamePiece = require('./gamepiece.js');
var User = require('./user.js');
var Log = require('./log.js');

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
