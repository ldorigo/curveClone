
var Game = {
    state: 'begin',
    frames: 0,
    holeColor: [200, 200, 200, 1],
    players: [],
    scoreChange: true
};

var dictKeys = {
    37: [0, -1, "Left"], //Left Arrow
    39: [0, 1, "Right"], //Right Arrow
    68: [1, 1, "d"], //d
    83: [1, -1, "s"], //s
    66: [2, -1, "b"], //b
    78: [2, 1, "n"], //n
    88: [3, -1, "x"], //x
    67: [3, 1, "c"] //c
};

// Using "keyCode" instead of "Key" for Chrome support. Not ideal since it's deprecate. To improve in the future.

function keyDownHandler(e, balls) {
    "use strict";
    if (e.keyCode in dictKeys) {
        var moveD = dictKeys[e.keyCode];
        e.preventDefault();

        if (!balls[moveD[0]])
            return;
        if (moveD[1] == 1) {
            balls[moveD[0]].rightPressed = true;
        } else {
            balls[moveD[0]].leftPressed = true;
        }
    }
}
function keyUpHandler(e, balls) {
    "use strict";
    if (e.keyCode in dictKeys) {
        var moveD = dictKeys[e.keyCode];
        e.preventDefault();
        if (!balls[moveD[0]])
            return;
        if (moveD[1] == 1) {
            balls[moveD[0]].rightPressed = false;
        } else {
            balls[moveD[0]].leftPressed = false;
        }
    }
}

//menu functions

function drawMenu(name) {
    if (name == "beginMenu") {

        var menuContainer = document.getElementById("playersDiv");
        menuContainer.style.top = Game.canvas.height / 2.5 + "px";
        menuContainer.style.left = Game.canvas.offsetLeft + Game.canvas.width / 8 + "px";
        menuContainer.style.fontSize = "44px";
        menuContainer.style.position = "absolute";

        var startButton = document.getElementById("startButtonContainer");
        startButton.style.position = "absolute";
        startButton.style.top = window.getComputedStyle(menuContainer).top;
        startButton.style.left = Game.canvas.offsetLeft + 400 + "px";

        //event listener on the start game button
        startButton.addEventListener("click", startGameButton, false);

        Game.ctx.fillStyle = "rgb(1,1,1)";
        Game.ctx.font = "100px serif";
        Game.ctx.fillText("CurveClone" +
            "", Game.canvas.width / 2 - Game.ctx.measureText("CurveClone").width / 2, Game.canvas.height / 4);

        if (document.getElementById("playersText").childElementCount < Game.players.length) {
            printPlayers();
        }
        if (document.getElementById("playersInput").childElementCount < 1 && Game.players.length < 4) {
            addPlayerLine();
        }
    }
    else if (name == "endGame") {

        var endMenu = document.getElementById("endMenu");
        var winnerLine = document.getElementById("winnerLine");

        endMenu.style.visibility = "visible";
        endMenu.style.top = Game.canvas.height / 3+ "px";
        endMenu.style.left = Game.canvas.offsetLeft + Game.canvas.width / 4 + 'px';
        endMenu.style.fontSize = "28px";
        clearNode(winnerLine);
        var text = "And the winner is...."
        var winner = "";
        for (var player in Game.players) {
            if (Game.players[player].state == 'won') {
                winner += "  " + Game.players[player].name + " ! ";
            }
        }
        var textNode = document.createTextNode(text);
        var winnerNode = document.createTextNode(winner + " ");
        winnerLine.appendChild(textNode);
        winnerLine.appendChild(winnerNode);

        var restartButton = document.getElementById("restartButton");

        restartButton.addEventListener("click",resetAndRestart,false);
    }

    if (Game.state == "begin") {
        window.requestAnimationFrame(function () {
            drawMenu("beginMenu");
        });
    } else if (Game.state == "endGame") {
        window.requestAnimationFrame(function () {
            drawMenu("endGame");
        });

    } else if (Game.state == "game") {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        startGame();
    }

}
function resetAndRestart(){
    location.reload();
}
function addButtonClick(name) {
    var input = document.getElementById("nameInput");

    if (input.value.length > 3 && input.value.length < 12 && Game.players.length < 4) {
        addPlayer(name);
        input.value = "";
        clearNode(document.getElementById("playersInput"));
    }

}
function addPlayer(name) {
    if (Game.players.length < 4) {
        Game.players.push({
            name: name,
            color: "rgba(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ",1)",
            score: 0,
            state: "normal"
        });
    }
}
function printPlayers() {    //print one player per line

    var lines = document.getElementById("playersText");
    lines.style.fontSize = "24px";

    clearNode(lines); //remove previously drawn lines

    for (var i = 0; i < Game.players.length; i++) {

        var line = document.createElement("p");
        lines.appendChild(line);
        var bullet = document.createElement('em');
        bullet.setAttribute('id', "bull" + i);
        line.appendChild(bullet);
        bullet.appendChild(document.createTextNode("•  "));
        var colorBall = document.getElementById("bull" + i);
        colorBall.style.color = Game.players[i].color;
        var name = document.createTextNode(Game.players[i].name);
        line.appendChild(name);

        var controlsText = "   (";
        var counterControls = 0;
        for (var element in dictKeys) {
            if (dictKeys[element][0] == i) {
                controlsText += dictKeys[element][2];
                counterControls++;
                controlsText += counterControls == 1 ? "/" : ')';
            }
        }

        var controls = document.createElement("em");
        controls.appendChild(document.createTextNode(controlsText));
        line.appendChild(controls);
        controls.style.fontStyle = "italic";
        controls.style.fontSize = "20px";
        lines.appendChild(line);

    }
}
function addPlayerLine() {
    if (Game.players.length < 4) {
        var div = document.getElementById("playersInput");

        var form = document.createElement("form");
        var inputText = document.createElement("input");
        inputText.setAttribute("type", "text");
        inputText.setAttribute("placeholder", "Choose Name");
        inputText.setAttribute("id", "nameInput");
        form.appendChild(inputText);

        var addButton = document.createElement("input");
        addButton.setAttribute("type", "button");
        addButton.setAttribute("value", "Add Player");
        addButton.setAttribute("id", "addPlayer");

        form.appendChild(addButton);

        inputText.style.zIndex = "2";
        addButton.style.marginLeft = "25px";
        div.appendChild(form);
        inputText.focus();

    }

    addButton.addEventListener("click", function () {
        addButtonClick(inputText.value, div)
    }, false);
    inputText.addEventListener("keypress", function (e) {

        if (e.keyCode == 13) {
            e.preventDefault();
            addButtonClick(inputText.value, div);
        }
    }, false)

}
function startGameButton() {

    // if there's at least one player, clear the menu and start the game
    if (Game.players.length > 1) {
        var menu = document.getElementById("beginMenu");
        menu.style.display = "none";
        Game.state = "game";
    }


}

// Game functions
function startGame() {
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    var balls = createBalls();
    Game.frames = 0;
    Game.maxScore = Game.players.length * 5;
    makeGrid(32);
    // start listening for key movement
    document.addEventListener("keydown", function (e) {
        keyDownHandler(e, balls);
    }, false);
    document.addEventListener("keyup", function (e) {
        keyUpHandler(e, balls);
    }, false);

    // Display scores on the side of the screen
    printScores();

    updateAndDraw(balls);
}

function createBalls() {
    // Returns an array of Ball objects
    var balls = [];
    for (var i = 0; i < Game.players.length; i++) {
        balls.push(createRandBall(Game.players[i].color));
    }
    return balls;
}

function createRandBall(color) {
    var w = Game.canvas.width;
    var h = Game.canvas.height;
    var perc = 0.9; // Percentage of canvas used

    var ball = {
        x: Math.floor((1 - perc) / 2 * w + Math.random() * w * perc),
        y: Math.floor((1 - perc) / 2 * h + Math.random() * h * perc),
        r: 3,
        dir: Math.random() * (Math.PI * 2),
        dx: 1,
        dy: 1,
        speed: 2,
        color: color,
        trail: [],
        tempTrail: [],
        leftPressed: false,
        rightPressed: false,
        hole: false,
        framesToHole: Math.floor(Math.random() * 100 + 15),
        holeStart: 0,
        touchesWall: false,
        touchesTrail: false,
        counter: 0
    };

    if (testPosition(ball)) {
        return ball;
    }
    else {
        return createRandBall(ball.color);
    }

}

function updateAndDraw(balls) {
        var i;
    for (i = 0; i < balls.length; i += 1) {
        if (Game.players[i].state == "normal") {
            balls[i] = updateBall(balls[i]);
        }
        if (balls[i].touchesWall || balls[i].touchesTrail) {
            Game.players[i].state = "lost";
            incrementOtherScores();
            printScores();
            balls[i].touchesTrail = false;
            balls[i].touchesWall = false;
        }
        if (Game.players[i].state == "normal") {
            drawBall(balls[i]);
        }
    }

    var leftPlayers = 0;
    for (i = 0; i < Game.players.length; i++) {
        if (Game.players[i].state == "normal") {
            leftPlayers++;
        }
    }

    var winner = false;

    if (leftPlayers == 1) {
        for (i = 0; i < Game.players.length; i++) {
            if (Game.players[i].state == "lost") {
                Game.players[i].state = "normal";
            }
            if (Game.players[i].score >= Game.maxScore) {
                Game.players[i].state = "won";
                winner = true;
            }
        }
        if (!winner) {
            Game.ctx.globalAlpha = 1;
            startGame();
            return;
        }
        else {
            Game.ctx.globalAlpha = 0;
            //fadeOut();
            Game.state = "endGame";
            drawMenu("endgame");
            return;
        }
    }

    if (Game.frames == 0){
        setTimeout(function () {
            Game.frames += 1;
            updateAndDraw(balls);

        }, 1000);
    }
    else {
        window.requestAnimationFrame(function () {
            updateAndDraw(balls);
            Game.frames += 1;
        });
    }

}
function touchWalls(ball) {
    // console.log("checking wall collision");
    if (ball.x <= ball.r || ball.x >= Game.canvas.width - ball.r || ball.y <= ball.r || ball.y >= Game.canvas.height - ball.r) {
        console.log("touched wall");
        return true;
    }
    return false;// Check if the ball coordinates are inside the canvas coordinates
}
function updateBall(ball) {
    // If the number of frames before next hole is 0, hole as true. Otherwise decrement.

    if (ball.framesToHole > 0) {
        ball.framesToHole--;
    } else {
        ball.hole = true;
    }

    // adjust dx and dy in function of pressed key
    if (ball.rightPressed) {
        ball.dir += Math.PI * ball.speed / 100;
    }
    if (ball.leftPressed) {
        ball.dir -= Math.PI * ball.speed / 100;
    }
    var coords = radToCoords(ball.dir),
        dx = coords.dx,
        dy = coords.dy,
        dxdy = Math.abs(dx) + Math.abs(dy);

    // Make the dx/dy match the speed

    dx = dx * ball.speed / dxdy;
    dy = dy * ball.speed / dxdy;


    // check if the ball touches a trail
    if (Game.frames > 15 && touchTrail(ball)) {
        ball.touchesTrail = true;
        return ball;
    }

    var touchWall = touchWalls(ball);
    // check if the ball is outside the frames (short buffer in the beginning)
    if (Game.frames > 15 && touchWall) {
        ball.touchesWall = true;
        return ball;
    }

    // update the ball's coordinates

    ball.x = ball.x + dx;
    ball.y = ball.y + dy;

    if (!ball.hole) {
        ball.tempTrail = [[ball.x, ball.y, ball.r]].concat(ball.tempTrail);
        if (ball.tempTrail.length > 2 * ball.r + 1) {
            addToGrid(ball.tempTrail.pop(), 32)
        }
    }


    // console.log("current pos: ("+ball.x + ","+ball.y+")");

    // if in hole state, update a counter until the hole finishes
    if (ball.hole) {
        ball.holeStart++;
        if (ball.holeStart == 15) {
            ball.hole = false;
            ball.framesToHole = Math.floor(Math.random() * 100 + 15);
            ball.holeStart = 0;
        }
    }
    return ball;

}

function drawBall(ball) {
    Game.ctx.beginPath();
    Game.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
    if (!ball.hole) {
        Game.ctx.fillStyle = ball.color;
    } else {
        Game.ctx.fillStyle = "rgba(" + Game.holeColor.join(",") + ")";

    }
    Game.ctx.fill();
    Game.ctx.closePath();
}

function touchTrail(ball) { //Similar to my old collision detection, but only inside the area around the ball


    var coordinates = Game.grid[Math.floor(Math.abs(ball.y / 32))][Math.floor(Math.abs(ball.x / 32))];
    for (var i = 0; i < coordinates.length; i++) {

        if (distance(ball.x, coordinates[i][0], ball.y, coordinates[i][1]) < (ball.r + coordinates[i][2])) {
            console.log("touched trail, frame:" + Game.frames);
            return true;
        }

    }


    return false;

}

function makeGrid(cellSize) {
    Game.grid = [];
    for (var i = 0; i < Game.canvas.height + cellSize; i += cellSize) {
        Game.grid.push([]);
        for (var j = 0; j < Game.canvas.width + cellSize; j += cellSize) {
            Game.grid[i / cellSize].push([]);
        }
    }
}

function addToGrid(coordinates, cellSize) {

    var x = Math.abs(coordinates[0]);
    var y = Math.abs(coordinates[1]);
    var r = coordinates[2];
    var xGrid = Math.floor(x / cellSize);
    var yGrid = Math.floor(y / cellSize);

    Game.grid[yGrid][xGrid].push([x, y, r]);
    //console.log("Added coordinates (" + x +","+y+") in cell (" +yGrid + ","+xGrid+")");

}

function radToCoords(rad) {
    return {
        dx: Math.cos(rad),
        dy: Math.sin(rad)
    };
}

function clearNode(node) {

    //remove the first child of the node until it hasn't got anymore
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function printScores() {

    var scores = document.getElementById("scores");

    clearNode(scores);

    scores.style.position = "absolute";
    scores.style.top = "80px";
    scores.style.left = Game.canvas.offsetLeft + Game.canvas.width + 30 + "px";
    var upperText = document.createTextNode("First to " +  Game.maxScore + " points!");
    scores.appendChild(upperText);
    for (var i = 0; i < Game.players.length; i++) {

        var line = document.createElement("p");
        scores.appendChild(line);
        var bullet = document.createElement('em');
        bullet.setAttribute('id', "bullScores" + i);
        line.appendChild(bullet);
        bullet.appendChild(document.createTextNode("•  "));
        var colorBall = document.getElementById("bullScores" + i);
        colorBall.style.color = Game.players[i].color;
        var name = document.createTextNode(Game.players[i].name);
        line.appendChild(name);

        var score = document.createTextNode(": " + Game.players[i].score);
        line.appendChild(score);

        scores.appendChild(line);

    }


}

function incrementOtherScores() {

    for (var i = 0; i < Game.players.length; i++) {

        if (Game.players[i].state == "normal") {
            Game.players[i].score++;
        }

    }

}

function distance(x1, x2, y1, y2) { // Compute distance between 2 points
    "use strict";
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function testPosition(ball) {

    if (ball.x + 90 * (radToCoords(ball.dir).dx) <= ball.r || ball.x + 50 * (radToCoords(ball.dir).dx) > Game.canvas.width - ball.r || ball.y + 50 * (radToCoords(ball.dir).dy) <= ball.r || ball.y + 50 * (radToCoords(ball.dir).dy) > Game.canvas.height - ball.r) {
        console.log("Bad position");

        return false;
    }

    return true;

}

function fadeOut() {
    Game.ctx.globalAlpha += 0.01;
    Game.ctx.fillStyle = "white";
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
    if(Game.ctx.globalAlpha <= 0.99) {
        window.requestAnimationFrame(fadeOut);
    }

    else return;

}


(function () {
    // Sets everything in motion
    Game.canvas = document.getElementById("myCanvas");
    Game.ctx = Game.canvas.getContext("2d");

    drawMenu("beginMenu");

}());

