var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var state = "begin";

// number of players

var numberOfPlayers = 1;
var buttonSize = 35 + 6;
var unPressCount = 0;
//  ball

var ballX = Math.floor(50 + Math.random() * (canvas.width - 100));
var ballY = Math.floor(50 + Math.random() * (canvas.height - 100));
var ballRadius = 3;
var direction = Math.floor(Math.random() * (Math.PI * 2));
var dx = 1;
var dy = 1;
var speed = 2;
var color = "rgba(221,12,132,1)";
// holes

var hole = false;
var holeStart = 0;
var oldX = 0;
var oldY = 0;
var frameCount = 0;
var framesToHole = Math.floor(15 + Math.random() * 100);


// Keyboard

var rightPressed = false;
var leftPressed = false;

var mouseDownX = 0;
var mouseDownY = 0;
var mouseX = 0;
var mouseY = 0;
var mouseUpX = 0;
var mouseUpY = 0;
var clickX= 0;
var clickY = 0;

var mouse = {
    X:0,
    Y:0,
    pressed:true
};
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
function drawBall() {
    "use strict";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
function moveBall() {
    "use strict";
    if (rightPressed) {             //change direction in function of keys
        direction += Math.PI * speed / 100;
    } else if (leftPressed) {
        direction -= Math.PI * speed / 100;

    }
    dx = radToCoordinates(direction).dx;
    dy = radToCoordinates(direction).dy;
    var dxdy = Math.abs(dx) + Math.abs(dy);

    dx = dx * speed / dxdy;
    dy = dy * speed / dxdy;
    oldX = ballX;
    oldY = ballY;
    ballX += dx;
    ballY += dy;
    if (hole == false) {
        tempTrail.push({                //if it's not in hole state, add current position to temporary trail
            X: ballX,
            Y: ballY,
            radius: ballRadius
        });

        counter += 1;
        if (counter > 5) {              //after a while, start copying the temporary trail to the trail (this is to avoid that the ball collides with the just-made trail)
            trail.push(tempTrail[0]);
            tempTrail = [];
            counter = 0;
        }
    }
}

function touchWalls() {
    "use strict";
    if (ballX < ballRadius || ballX > canvas.width - ballRadius || ballY < ballRadius || ballY > canvas.height - ballRadius) {
        return true;
    }
    return false;
}

function distance(x1, x2, y1, y2) {  // Compute distance between 2 points
    "use strict";
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function touchTrail() {      //detect contact with trail
    "use strict";
    var t, dist;
    for (t = 0; t < trail.length; t += 1) {
        dist = distance(trail[t].X, ballX, trail[t].Y, ballY);
        if (dist < ballRadius * 2) {
            console.log(dist);
            return true;

        }
    }
    return false;
}

function drawMenu() {
    // Characteristics of + and - and start buttons:
    var bM = {
        rX: (canvas.width / 2) + 25,
        rY: canvas.height / 2 - buttonSize + 3,
        W: buttonSize,
        H: buttonSize,
        text: "-",
        tX: canvas.width / 2 + 25 + 8,
        tY: canvas.height / 2,
        rColor: 'rgba(122,122,122,0.1)',
        tColor: "rgb(1,1,1)"
    };

    var bP = {
        rX: (canvas.width / 2) + 25 + buttonSize + 6 + 10,
        rY: canvas.height / 2 - buttonSize + 3,
        W: buttonSize,
        H: buttonSize,
        text: "+",
        tX: canvas.width / 2 + 25 + 3 + buttonSize + 6 + 10,
        tY: canvas.height / 2,
        rColor: 'rgba(122,122,122,0.1)',
        tColor: "rgb(1,1,1)"
    };

    var bStart = {
        rX: (canvas.width / 2) ,
        rY: canvas.height / 2 + 15,
        W: ctx.measureText("Start Game!").width + 6,
        H: buttonSize,
        text: "Start Game!",
        tX: canvas.width / 2 ,
        tY: canvas.height / 2+15+buttonSize,
        rColor: 'rgba(122,122,122,0.1)',
        tColor: "rgb(1,1,1)"
    };




    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //change button colours when hovering

    if (mouseX >= bM.rX && mouseX <= bM.rX + buttonSize && mouseY >= bM.rY && mouseY <= bM.rY + buttonSize) {
        bM.rColor = 'rgba(0,0,122,0.5)';
    }
    else if (mouseX >= bP.rX && mouseX <= bP.rX + buttonSize && mouseY >= bP.rY && mouseY <= bP.rY + buttonSize) {
        bP.rColor = 'rgba(0,0,122,0.5)';
    }
    else if (mouseX >= bStart.rX && mouseX <= bStart.rX + bStart.W && mouseY >= bStart.rY && mouseY <= bStart.rY + buttonSize) {
        bStart.rColor = 'rgba(0,0,122,0.5)';
    }
    else {
        bP.rColor = 'rgba(122,122,122,0.1)';
        bM.rColor = 'rgba(122,122,122,0.1)';
        bStart.rColor =  'rgba(122,122,122,0.1)';
    }
    // Add or remove players when clicking buttons
    if (clickX >= bM.rX && clickX <= bM.rX + buttonSize && clickY >= bM.rY && clickY <= bM.rY + buttonSize) {

            if (numberOfPlayers > 1 ) {
                numberOfPlayers -= 1;
            }

    }
    else if (clickX >= bP.rX && clickX <= bP.rX + buttonSize && clickY >= bP.rY && clickY <= bP.rY + buttonSize) {
        if (numberOfPlayers < 4) {
            numberOfPlayers += 1;
        }
    }
    //Click start button

    else if (clickX >= bStart.rX && clickX <= bStart.rX + bStart.W && clickY >= bStart.rY && clickY <= bStart.rY + buttonSize) {
        state="game";
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    //draw text

    ctx.fillStyle = "rgb(1,1,1)";
    ctx.font = "24px serif";
    ctx.fillText("Select number of players: ", canvas.width / 2 - ctx.measureText("Select number of players: ").width, canvas.height / 2);
    ctx.fillText(" " + numberOfPlayers, canvas.width / 2, canvas.height / 2);

    //draw + and - buttons
    ctx.font = "35px serif";
    buttonSize = ctx.measureText("+").width + 6;
    ctx.beginPath();
    ctx.fillStyle = bM.rColor;
    ctx.fillRect(bM.rX, bM.rY, bM.W, bM.H);
    ctx.fillStyle = bP.rColor;
    ctx.fillRect(bP.rX, bM.rY, bP.W, bP.W);
    ctx.fillStyle = bM.tColor;
    ctx.fillText('-', bM.tX, bM.tY);
    ctx.fillText('+', bP.tX, bP.tY);
    ctx.closePath();


    // Draw start button
    ctx.font = "24px serif";
    ctx.beginPath();
    ctx.fillStyle = bStart.rColor;
    ctx.fillRect(bStart.rX, bStart.rY, bStart.W, bStart.H);
    ctx.fillStyle = bStart.tColor;
    ctx.fillText(bStart.text,bStart.tX,bStart.tY);
    ctx.closePath();

    clickX =0;
    clickY = 0;

}






// main function

function draw() {
    "use strict";
    if (state == "begin") {
        drawMenu();

    }
    else if (state =="game") {
        if (frameCount==0){
            ctx.clearRect(0,0,canvas.width,canvas.height);

        }
        frameCount++;
        if (framesToHole == 0) {
            hole = true;
        }
        moveBall();
        drawBall();
        if (hole) {
            holeStart++;
            color = "rgba(0,0,0,0.1)";
            if (holeStart == 15) {
                hole = false;
                holeStart = 0;
                framesToHole = Math.floor(15 + Math.random() * 100);
                color = "rgba(221,12,132,1)";
            }
        }
        else {
            framesToHole--;
        }

        if (touchWalls() || touchTrail()) {
            state = "begin";
            document.location.reload();

        }
    }
    requestAnimationFrame(draw);
}

//Keyboard events functions

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousedown", doMouseDown, false);
document.addEventListener("mousemove", doMouseMove, false);
document.addEventListener("mouseup", doMouseUp, false);
document.addEventListener("click", doClick, false);


function doMouseMove(e) {
    "use strict";
    mouseX = e.pageX-canvas.offsetLeft;
    mouseY = e.pageY;

}
function doClick(e) {
    "use strict";
    clickX = e.pageX-canvas.offsetLeft;
    clickY = e.pageY;

}

function doMouseDown(e) {
    "use strict";
    mouseDownX = e.pageX-canvas.offsetLeft;
    mouseDownY = e.pageY;

}
function doMouseUp(e) {
    "use strict";
    mouse.X = e.pageX-canvas.offsetLeft;
    mouseUpY = e.pageY;

}
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
