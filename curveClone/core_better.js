
/*global window */
// ^^ Comment for jsLint
var Game = {
    state: 'begin',
    frames: 0,
    holeColor: [200, 200, 200, 50],
    players: []

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

// var used = [];


// Using "keyCode" instead of "Key" for Chrome support. Not ideal since it's deprecate. To improve in the future.

function keyDownHandler(e, balls) {
    "use strict";
    if (e.keyCode in dictKeys) {
        var moveD = dictKeys[e.keyCode];
        e.preventDefault();

        if(!balls[moveD[0]])
            return ;
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
        if(!balls[moveD[0]])
            return ;
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
        startButton.style.position="absolute";
        startButton.style.top = window.getComputedStyle(menuContainer).top;
        startButton.style.left = Game.canvas.offsetLeft + 400 + "px";

        startButton.addEventListener("click",startGameButton,false);

        Game.ctx.fillStyle = "rgb(1,1,1)";
        Game.ctx.font = "100px serif";
        Game.ctx.fillText("CurveClone" +
            "", Game.canvas.width / 2 - Game.ctx.measureText("CurveClone").width / 2, Game.canvas.height / 4);


        printPlayers();

        if (document.getElementById("playersInput").childElementCount < 1 && Game.players.length < 4) {
            addPlayerLine();
        }


    }
    else if (name == "lost") {
        Game.ctx.fillStyle = "rgb(1,1,1)";
        Game.ctx.font = "44px serif";
        Game.ctx.fillText("Game Over!", Game.canvas.width / 2 - Game.ctx.measureText("Game Over!").width, Game.canvas.height / 2);
        return;
    }

    if (Game.state == "begin") {
        window.requestAnimationFrame(function () {
            drawMenu("beginMenu");
        });
    } else if (Game.state == "lost") {
        drawMenu("lost");

    } else if (Game.state == "game") {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        startGame();
    }

}
function addButtonClick(name, div) {
    var input = document.getElementById("nameInput");

    if (input.value.length > 3 && input.value.length < 12 && Game.players.length<5) {
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
            score: 0
        });
    }
}
function printPlayers() {    //print one player per line

    var lines = document.getElementById("playersText");
    lines.style.fontSize = "24px";

    while (lines.firstChild) { // clear previously made lines
        lines.removeChild(lines.firstChild);
    }

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

function startGameButton(){

    var menu = document.getElementById("beginMenu");

    menu.style.display="none";

    Game.state="game";



}

// Game functions
function startGame() {
    "use strict";
    var balls = createBalls();

    document.addEventListener("keydown", function (e) {
        keyDownHandler(e, balls);
    }, false);
    document.addEventListener("keyup", function (e) {
        keyUpHandler(e, balls);
    }, false);


    updateAndDraw(balls);
}

function createBalls() {
    "use strict";
    // Returns an array of Ball objects
    var balls = [];
    for (var player in Game.players) {
        balls.push(createRandBall(Game.players[player].color));
    }
    return balls;
}

function createRandBall(color) {
    "use strict";
    var w = Game.canvas.width;
    var h = Game.canvas.height;
    var perc = 0.9; // Percentage of canvas used
    return {
        x: Math.floor((1 - perc) / 2 * w + Math.random() * w * perc),
        y: Math.floor((1 - perc) / 2 * h + Math.random() * h * perc),
        oldX: 0,
        oldY: 0,
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
        counter: 0,
        touchesWall: false,
        touchesTrail: false
    };
}

function updateAndDraw(balls) {
    "use strict";
    var i;
    for (i = 0; i < balls.length; i += 1) {
        balls[i] = updateBall(balls[i], balls);
    }
    for (i = 0; i < balls.length; i += 1) {
        drawBall(balls[i]);
    }
    var lostF = function () {
        drawMenu("lost");
    };
    for (i = 0; i < balls.length; i += 1) {
        if (balls[i].touchesWall && Game.frames > 300 || balls[i].touchesTrail&&Game.frames>50) {
            Game.state = "lost";
            window.requestAnimationFrame(lostF);
            return;
        }
    }
    window.requestAnimationFrame(function () {
        updateAndDraw(balls);
        Game.frames += 1;

    });
}

function updateBall(ball) {
    "use strict";
    if (ball.framesToHole > 0) {
        ball.framesToHole--;
    } else {
        ball.hole = true;
    }
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

    dx = dx * ball.speed / dxdy;
    dy = dy * ball.speed / dxdy;

    if (Game.frames > 500 && touchWalls(ball)) {
        ball.touchesWall = true;
    }

    if (Game.frames > 150 && touchTrail(ball, dx, dy)) {
        ball.touchesTrail = true;
    }

    ball.oldX = ball.x;
    ball.oldY = ball.y;

    ball.x = ball.x+dx;
    ball.y = ball.y+dy;
    if (!ball.hole) {

        ball.counter++;
    } else {
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
    "use strict";
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


//Helper functions

function touchWalls(ball) {
    "use strict";
    return (ball.x <= ball.r ||
    ball.x >= Game.canvas.width - ball.r ||
    ball.y <= ball.r ||
    ball.y >= Game.canvas.height - ball.r);
}

function touchTrail(ball, dx, dy) {
    "use strict";

    // Grab the pixel data at the current x y coords: i'm sure flash has an equivalent function //

    var pixelData = Game.ctx.getImageData(ball.x + dx*3.01 , ball.y + dy*3.01, 1, 1).data;

    //Get the Alpha value [r, g, b, a]
    //Alpha will be 255 if solid colour
    var DELTA = 10;
    if ((pixelData[0] || pixelData[1] || pixelData[2]) && !(Math.abs(pixelData[0] - Game.holeColor[0]) < DELTA && // Hole color check
        Math.abs(pixelData[1] - Game.holeColor[1]) < DELTA &&
        Math.abs(pixelData[2] - Game.holeColor[2]) < DELTA))

    {
        console.log("x: " + Math.floor(ball.x + dx * 3) + " y:  " + Math.floor(ball.y + dy * 3));
        console.log(Game.ctx.getImageData(Math.floor(ball.x + dx * 3), Math.floor(ball.y + dy * 3), 1, 1).data);
        console.log("dx, dy:" +dx, dy);

        console.log("touched trail");


        return true;
    } else {
        return false;
    }

}
function distance(x1, x2, y1, y2) { // Compute distance between 2 points
    "use strict";
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function radToCoords(rad) {
    "use strict";
    return {
        dx: Math.cos(rad),
        dy: Math.sin(rad)
    };
}

function clearNode(node){

    while(node.firstChild){
        node.removeChild(node.firstChild);
    }
}

(function () {
    "use strict";
    // Sets everything in motion
    Game.canvas = document.getElementById("myCanvas");
    Game.ctx = Game.canvas.getContext("2d");

    drawMenu("beginMenu");

}());

