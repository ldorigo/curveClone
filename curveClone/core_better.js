/*global window */
// ^^ Comment for jsLint
var Game = {state: 'begin'};
var general = {
    numberOfPlayers: 4
};
var mouse = {
    x: 0,
    y: 0,
    clicked: false
};
var dictKeys = {
    37: [0, -1], //Left Arrow
    39: [0, 1], //Right Arrow
    68: [1, 1], //d
    83: [1, -1] //s
};

document.addEventListener("click", function () {
    doClick();
}, false);
document.addEventListener("mousemove", doMouseMove, false);

function doClick() {
    "use strict";
    mouse.clicked = true;
}
function doMouseMove(e) {
    mouse.x = e.pageX - Game.canvas.offsetLeft;
    mouse.y = e.pageY;
}

// Using "keyCode" instead of "Key" for Chrome support. Not ideal since it's deprecate. To improve in the future.

function keyDownHandler(e, balls) {
    "use strict";
    if (e.keyCode in dictKeys) {
        var moveD = dictKeys[e.keyCode];
        if (moveD[1] == 1) {
            balls[moveD[0]].rightPressed = true;
        }
        else {
            balls[dictKeys[e.keyCode][0]].leftPressed = true;
        }
    }
}
function keyUpHandler(e, balls) {
    "use strict";
    if (e.keyCode in dictKeys) {
        var moveD = dictKeys[e.keyCode];
        if (moveD[1] == 1) {
            balls[moveD[0]].rightPressed = false;
        }
        else {
            balls[dictKeys[e.keyCode][0]].leftPressed = false;
        }
    }
}

//menu functions

function drawMenu(name) {
    if (name == "beginMenu") {

        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

        // Make and draw butts

        var butts = [];
        butts.push({
            rX: (Game.canvas.width / 2),
            rY: Game.canvas.height / 2 + 15,
            W: Game.ctx.measureText("Start Game!").width + 6,
            H: 45,
            text: "Start Game!",
            fontsize: '35pt',
            tX: Game.canvas.width / 2,
            tY: Game.canvas.height / 2 + 15 + 45,
            color: 'rgba(122,122,122,0.1)',
            tColor: "rgb(1,1,1)",
            hoverColor: 'rgba(122,122,122,0.5)',
            normalColor: 'rgba(122,122,122,0.1)',
            action: function () {
                Game.state = "game";
            }
        });
        butts.push({
            rX: (Game.canvas.width / 2) + 25 + 45 + 6 + 10,
            rY: Game.canvas.height / 2 - 45 + 3,
            W: 45,
            H: 45,
            text: "+",
            fontSize: '35pt',
            tX: Game.canvas.width / 2 + 25 + 3 + 45 + 6 + 10,
            tY: Game.canvas.height / 2,
            color: 'rgba(122,122,122,0.1)',
            tColor: "rgb(1,1,1)",
            hoverColor: 'rgba(122,122,122,0.5)',
            normalColor: 'rgba(122,122,122,0.1)',
            action: function () {
                if (general.numberOfPlayers < 5) {
                    general.numberOfPlayers++;
                }
            }
        });
        butts.push({
                rX: (Game.canvas.width / 2) + 25,
                rY: Game.canvas.height / 2 - 45 + 3,
                W: 45,
                H: 45,
                text: "-",
                fontSize: "35pt",
                tX: Game.canvas.width / 2 + 25 + 8,
                tY: Game.canvas.height / 2,
                color: 'rgba(122,122,122,0.1)',
                tColor: "rgb(1,1,1)",
                hoverColor: 'rgba(122,122,122,0.5)',
                normalColor: 'rgba(122,122,122,0.1)',
                action: function () {
                    if (general.numberOfPlayers > 1) {
                        general.numberOfPlayers--;
                    }
                }
            });

        Game.ctx.fillStyle = "rgb(1,1,1)";
        Game.ctx.font = "24px serif";
        Game.ctx.fillText("Select number of players: ", Game.canvas.width / 2 - Game.ctx.measureText("Select number of players: ").width, Game.canvas.height / 2);
        Game.ctx.fillText(" " + general.numberOfPlayers, Game.canvas.width / 2, Game.canvas.height / 2);

        for (var i = 0; i < butts.length; i++) {
            updateButton(butts[2-i]);
        }
        for (var j = 0; j < butts.length; j++) {
            drawButton(butts[j]);
        }
    }



    if (Game.state == "begin") {
        mouse.clicked=false;
        window.requestAnimationFrame(function () {
            drawMenu("beginMenu")
        });
    }
    else {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        startGame(general.numberOfPlayers);
    }

}
function updateButton(butt) {
    if (mouse.x >= butt.rX && mouse.x <= butt.rX + butt.W && mouse.y >= butt.rY && mouse.y <= butt.rY + butt.H && mouse.clicked == false) {
        butt.color = butt.hoverColor;
    }
    else if (mouse.x >= butt.rX && mouse.x <= butt.rX + butt.W && mouse.y >= butt.rY && mouse.y <= butt.rY + butt.H && mouse.clicked == true) {
        butt.action();
    }
    else {
        butt.color = butt.normalColor;
    }
}
function drawButton(butt) {
    Game.ctx.beginPath();
    Game.ctx.font = butt.fontSize;
    Game.ctx.fillStyle = butt.color;
    Game.ctx.fillRect(butt.rX, butt.rY, butt.W, butt.H);
    Game.ctx.fillStyle = butt.tColor;
    Game.ctx.fillText(butt.text, butt.tX, butt.tY);
    Game.ctx.closePath();
}

// Game functions
function startGame(nPlayers) {
    "use strict";
    var balls = createBalls(nPlayers);

    document.addEventListener("keydown", function (e) {
        keyDownHandler(e, balls);
    }, false);
    document.addEventListener("keyup", function (e) {
        keyUpHandler(e, balls);
    }, false);


    updateAndDraw(balls);
}
function createBalls(nPlayers) {
    "use strict";
    // Returns an array of Ball objects
    var balls = [];
    var i;
    for (i = 0; i < nPlayers; i += 1) {
        balls.push(createRandBall());
    }
    return balls;
}
function createRandBall() {
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
        color: "rgba(221,12,132,1)",
        trail: [],
        tempTrail: [],
        leftPressed: false,
        rightPressed: false,
        hole: false,
        framesToHole: Math.floor(Math.random() * 100 + 15),
        holeStart: 0,
        counter: 0,
        touchesWall:false,
        touchesTrail: false
    };
}
function updateAndDraw(balls) {
    "use strict";
    var i;
    for (i = 0; i < balls.length; i += 1) {
        balls[i] = updateBall(balls[i]);
    }
    for (i = 0; i < balls.length; i += 1) {
        drawBall(balls[i]);
    }

    for (i = 0; i < balls.length; i += 1) {
        if(balls[i].touchesWall){
            alert("You lost!");
        }
    }
    window.requestAnimationFrame(function () {
        updateAndDraw(balls);
    });
}
function updateBall(ball) {
    "use strict";
    if(ball.framesToHole>0){
        ball.framesToHole--;
    }
    else{
        ball.hole=true;
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

    if(touchWalls(ball)){
        ball.touchesWall=true;
    }

    ball.oldX = ball.x;
    ball.oldY = ball.y;

    ball.x += dx;
    ball.y += dy;
    if (ball.hole == false) {
        ball.tempTrail.push({  //if it's not in hole state, add current position to temporary trail
            X: ball.x,
            Y: ball.y,
            r: ball.r
        });
        ball.counter++;
        if (ball.counter > (ball.r + 1)) {
            for (var i = 0; i < ball.tempTrail.length; i++) {
                ball.trail.push(ball.tempTrail[i]);
            }
            ball.tempTrail = [];
        }
    }
    else{
        ball.holeStart ++;
        if(ball.holeStart==15){
            ball.hole=false;
            ball.framesToHole=Math.floor(Math.random()*100 + 15);
            ball.holeStart=0;
        }
    }
    return ball;

}
function drawBall(ball) {
    "use strict";
    Game.ctx.beginPath();
    Game.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
    if(ball.hole==false){
        Game.ctx.fillStyle = ball.color;
    }
    else{
        Game.ctx.fillStyle = "rgba(122,122,122,0.1)";

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
function touchTrail(ball,balls) {      //detect contact with trail
    "use strict";
    var t, dist;
    for (t = 0; t < balls[1].trail.length; t += 1) {
        dist = distance(balls[1].trail[t].X, balls[1].X, balls[1].trail[t].Y, balls[1].Y);
        if (dist <= balls[1].r * 2) {
            console.log(dist);
            return true;

        }
    }
    return false;
}
function distance(x1, x2, y1, y2) {  // Compute distance between 2 points
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






(function () {
    "use strict";
    // Sets everything in motion
    Game.canvas = document.getElementById("myCanvas");
    Game.ctx = Game.canvas.getContext("2d");

    drawMenu("beginMenu");

}());

