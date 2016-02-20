var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// position ball

var ballX = Math.floor(Math.random() * canvas.width);
var ballY = Math.floor(Math.random() * canvas.height);
var ballRadius = 3;
var direction = Math.floor(Math.random() * (Math.PI * 2));
var dx = 1;
var dy = 1;
var speed = 2;

// Keyboard

var rightPressed = false;
var leftPressed = false;

// trace

var trace = [];
var tempTrace = [];
var counter = 0;

function radToCoordinates(rad) {
    "use strict";
    var dx = Math.cos(rad),
            dy = Math.sin(rad);
    return {
        dx: dx,
        dy: dy
    };
}

function drawBall() {
    "use strict";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function moveBall() {
    "use strict";
    if (rightPressed) {
        direction += Math.PI * speed / 100;
    } else if (leftPressed) {
        direction -= Math.PI * speed / 100;

    }
    dx = radToCoordinates(direction).dx;
    dy = radToCoordinates(direction).dy;
    var dxdy = Math.abs(dx) + Math.abs(dy);

    dx = dx * speed / dxdy;
    dy = dy * speed / dxdy;

    ballX += dx;
    ballY += dy;
    tempTrace.push({
        X: ballX,
        Y: ballY,
        radius: ballRadius
    });
    counter += 1;
    if (counter > 5) {
        trace.push(tempTrace[0]);
        tempTrace = [];
        counter = 0;

    }
}

function touchWalls() {
    "use strict";
    if (ballX < ballRadius || ballX > canvas.width - ballRadius || ballY < ballRadius || ballY > canvas.height - ballRadius) {
        return true;
    }
    return false;
}

function distance(x1, x2, y1, y2) {
    "use strict";
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function touchTrail() {
    "use strict";
    var t, dist;
    for (t = 0; t < trace.length; t += 1) {
        dist = distance(trace[t].X, ballX, trace[t].Y, ballY);
        if (dist < ballRadius * 2) {
            console.log(dist);
            return true;

        }
    }
    return false;
}


function draw() {
    "use strict";
    drawBall();
    moveBall();
    if (touchWalls() || touchTrail()) {
        console.log(trace);
        alert("Game Over!");
        document.location.reload();

    }
    requestAnimationFrame(draw);
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    "use strict";
    if (e.keyCode === 39) {
        rightPressed = true;
    } else if (e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    "use strict";
    if (e.keyCode === 39) {
        rightPressed = false;
    } else if (e.keyCode === 37) {
        leftPressed = false;
    }
}

draw();
