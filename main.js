// Draw Canvas
const canvas = document.getElementById("brickbreaker");
const ctx = canvas.getContext("2d");

canvas.style.border = "1px solid";
ctx.lineWidth = 2;

// Global Variables and Constants
const tokenWidth = 100;
const tokenMarginBottom = 50;
const tokenHeight =20;

const ballRadius = 8;

const brick = {
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,

    fillColor: "#000000",
    strokeColor: "#ffffff",
}

let leftArrow = false;
let rightArrow = false;
let playerLife = 3;

// Token Outline
const token = {
    x: canvas.width/2 - tokenWidth/2,
    y: canvas.height - tokenMarginBottom - tokenHeight,
    width: tokenWidth,
    height: tokenHeight,
    dx: 5
}

// Token Control
document.addEventListener("keydown", function(event) {
    if(event.keyCode == 37) {
        leftArrow = true;
    }else if(event.keyCode == 39) {
        rightArrow = true;
    }
});

document.addEventListener("keyup", function(event) {
    if(event.keyCode == 37) {
        leftArrow = false;
    }else if(event.keyCode == 39) {
        rightArrow = false;
    }
});

function controlToken() {
    if(rightArrow && token.x + token.width < canvas.width) {
        token.x += token.dx;

    }else if(leftArrow && token.x > 0) {
        token.x -= token.dx;
    }
}

// Token Creation
function createToken() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(token.x, token.y, token.width, token.height);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(token.x, token.y, token.width, token.height)
}

// Ball Outline
const ball = {
    x: canvas.width/2,
    y: token.y - ballRadius,
    radius: ballRadius,
    velocity: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

// Ball Creation
function createBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle ="#ff0000";
    ctx.fill();

    ctx.strokeStyle ="#ffffff";
    ctx.stroke();
    ctx.closePath();
}

// Ball Control
function controlBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Ball Reset
function ballReset() {
    ball.x = canvas.width/2;
    ball.y = token.y - ballRadius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// Ball touching the wall
function ballTouchingWall() {
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = - ball.dx;
    }

    if(ball.y - ball.radius < 0) {
        ball.dy = - ball.dy;
    }
    
    if(ball.y + ball.radius > canvas.height) {
        playerLife--;
        ballReset();
    }
}

// Ball touching the token
function ballTouchingToken() {
    if(ball.x < token.x + token.width && ball.x > token.x && token.y < token.y + token.height && ball.y > token.y) {

        let touchPoint = ball.x - (token.x + token.width/2);

        touchPoint = touchPoint / (token.width/2);

        let touchAngle = touchPoint * Math.PI/3;


        ball.dx = ball.velocity * Math.sin(touchAngle);
        ball.dy = - ball.velocity * Math.cos(touchAngle);
    }
}


// Game Functions
function create() {

    createToken();

    createBall();
}

function update() {

    controlToken();

    controlBall();    

    ballTouchingWall();

    ballTouchingToken();

    
}

// Game Loop
function loop() {

    ctx.drawImage(backgroundImage, 0, 0);
    create();

    update();

    requestAnimationFrame(loop);
}

loop();