var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


function Ball() {
    // 90% of the width/height
    this.x = Math.floor(Math.random() * canvas.width * 0.90);
    this.y = Math.floor(Math.random() * canvas.height * 0.90);
    this.r = 3;
    this.dir = Math.random() * (Math.PI * 2);
    this.dx = 1;
    this.dy = 1;
    this.v = 2;
    this.color ="rgba(221,12,132,1)";

}

var hole=false;
var holeStart = 0;
var oldX=0;
var oldY=0;
var frameCount =0;
var framesToHole = Math.floor(15 + Math.random()*100);


// Keyboard

var rightPressed = false;
var leftPressed = false;

// trace

var trail = [];
var tempTrail = [];
var counter = 0;

function radToCoordinates(rad) {    //convert a direction in radians to dx and dy
    "use strict";
    var dx = Math.cos(rad),
        dy = Math.sin(rad);
    return {
        dx: dx,
        dy: dy
    };
}
function drawBall(ball) {
    "use strict";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function moveBall(ball) {
    "use strict";
    if (rightPressed) {             //change direction in function of keys
        ball.dir += Math.PI * ball.v / 100;
    } else if (leftPressed) {
        ball.dir -= Math.PI * ball.v / 100;

    }
    ball.dx = radToCoordinates(ball.dir).dx;
    ball.dy = radToCoordinates(ball.dir).dy;
    var dxdy = Math.abs(ball.dx) + Math.abs(ball.dy);

    ball.dx = ball.dx * ball.v / dxdy;
    ball.dy = ball.dy * ball.v / dxdy;
    oldX=ball.x;
    oldY=ball.y;
    ball.x += ball.dx;
    ball.y += ball.dy;
    if(hole == false) {
        tempTrail.push({                //if it's not in hole state, add current position to temporary trail
            X: ball.x,
            Y: ball.y,
            radius: ball.r
        });

        counter += 1;
        if (counter > 5) {              //after a while, start copying the temporary trail to the trail (this is to avoid that the ball collides with the just-made trail)
            trail.push(tempTrail[0]);
            tempTrail = [];
            counter = 0;
        }
    }
    return ball;
}

function touchWalls(ball) {
    "use strict";
    if (ball.x <= ball.r || ball.x >= canvas.width - ball.r || ball.y <= ball.r || ball.y >= canvas.height - ball.r) {
        return true;
    }
    return false;
}

function distance(x1, x2, y1, y2) {  // Compute distance between 2 points
    "use strict";
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function touchTrail(ball) {      //detect contact with trail
    "use strict";
    var t, dist;
    for (t = 0; t < trail.length; t += 1) {
        dist = distance(trail[t].X, ball.x, trail[t].Y, ball.y);
        if (dist <= ball.r * 2) {
            console.log(dist);
            return true;

        }
    }
    return false;
}



// main function

function draw(ball) {
    "use strict";
    frameCount ++;
    if(framesToHole==0){
        hole=true;
    }
    ball = moveBall(ball);
    drawBall(ball);
    if(hole){
        holeStart ++;
        ball.color="rgba(0,0,0,0.1)";
        if(holeStart == 15){
            hole = false;
            holeStart=0;
            framesToHole = Math.floor(15 + Math.random()*100);
            ball.color="rgba(221,12,132,1)";
        }
    }
    else{
        framesToHole--;
    }
    if ( (frameCount > 300 && touchWalls(ball) || touchTrail(ball))) {
        console.log(trail);
        alert("Game Over!");
        startGame();
        return;

    }
    requestAnimationFrame(function(){
        draw(ball);
    });
}

    //Keyboard events functions

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
function startGame() {
    hole=false;
    holeStart = 0;
    oldX=0;
    oldY=0;
    frameCount =0;
    framesToHole = Math.floor(15 + Math.random()*100);
    // Keyboard
    rightPressed = false;
    leftPressed = false;
    // trace
    trail = [];
    tempTrail = [];
    counter = 0;
    ctx.clearRect(0,0, canvas.width, canvas.height)
    draw(new Ball());   
}

startGame();
