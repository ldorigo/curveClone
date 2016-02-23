/*global window */
// ^^ Comment for jsLint
var Game = {};

function radToCoords(rad) {
    "use strict";
    return {
        dx: Math.cos(rad),
        dy: Math.sin(rad)
    };
}

function createRandBall() {
    "use strict";
    var canvas = Game.canvas;
    var w = canvas.width;
    var h = canvas.height;
    var perc = 0.9; // Percentage of canvas used
    return {
        x: Math.floor((1 - perc) / 2 * w + Math.random() * w * perc),
        y: Math.floor((1 - perc) / 2 * h + Math.random() * h * perc),
        r: 3,
        dir: Math.random() * (Math.PI * 2),
        dx: 1,
        dy: 1,
        speed: 2,
        color: "rgba(221,12,132,1)",
        leftPressed: false,
        rightPressed: false
    };
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

function drawBall(ball) {
    "use strict";
    var ctx = Game.ctx;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function updateBall(ball) {
    "use strict";
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
    /*var oldX = ball.x,
        oldY = ball.y;*/
    ball.x += dx;
    ball.y += dy;

    return ball;

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
    
    window.requestAnimationFrame(function () {
        updateAndDraw(balls);
    });
}

function keyDownHandler(e, balls) {
    "use strict";
    var cb;
    if (e.key === "ArrowLeft") {
        cb = function (ball) {
            ball.leftPressed = true;
        };
    }
    if (e.key === "ArrowRight") {
        cb = function (ball) {
            ball.rightPressed = true;
        };
    }
    balls.map(cb);
}

function keyUpHandler(e, balls) {
    "use strict";
    var cb;
    if (e.key === "ArrowLeft") {
        cb = function (ball) {
            ball.leftPressed = false;
        };
    }
    if (e.key === "ArrowRight") {
        cb = function (ball) {
            ball.rightPressed = false;
        };
    }
    balls.map(cb);
}

function startGame(nPlayers) {
    "use strict";
    var balls = createBalls(nPlayers);
    document.addEventListener("keydown", function(e) {
        keyDownHandler(e, balls);
    }, false);
    document.addEventListener("keyup", function(e) {
        keyUpHandler(e, balls);
    }, false);
    updateAndDraw(balls);
}

(function () {
    "use strict";
    // Sets everything in motion
    Game.canvas = document.getElementById("myCanvas");
    Game.ctx = Game.canvas.getContext("2d");

    startGame(50);

}());

