var Game = require('./models/game.js');
var User = require('./models/user.js');

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
