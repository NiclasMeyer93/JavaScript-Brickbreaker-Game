// Draw Canvas
const canvas = document.getElementById("brickbreaker");
const ctx = canvas.getContext("2d");

canvas.style.border = "1px solid";
ctx.lineWidth = 2;

// Global Variables and Constants
const tokenWidth = 100;
const tokenMarginBottom = 50;
const tokenHeight = 20;


let leftArrow = false;
let rightArrow = false;

let playerLife = 3;
let currentLevel = 1;
let gameOver = false;
let brokeAllBricks = false;

const gameOverScreen = document.getElementById("gameoverscreen");
const restart = document.getElementById("restart");

const ballRadius = 8;

const brick = {
    row: 4,
    column: 6,
    width: 60,
    height: 20,
    offSetLeft: 6,
    offSetTop: 30,
    marginTop: 20,
    fillColor: "#cc66ff",
    strokeColor: "#ffffff"
}

let bricks = [];

// Token Outline
const token = {
    x: canvas.width / 2 - tokenWidth / 2,
    y: canvas.height - tokenMarginBottom - tokenHeight,
    width: tokenWidth,
    height: tokenHeight,
    dx: 5
}

// Token Control
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 37) {
        leftArrow = true;
    } else if (event.keyCode == 39) {
        rightArrow = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode == 37) {
        leftArrow = false;
    } else if (event.keyCode == 39) {
        rightArrow = false;
    }
});

function controlToken() {
    if (rightArrow && token.x + token.width < canvas.width) {
        token.x += token.dx;

    } else if (leftArrow && token.x > 0) {
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



// Brick Outline
function outlineBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }

}

outlineBricks();

// Brick Creation
function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }

}


// Ball Outline
const ball = {
    x: canvas.width / 2,
    y: token.y - ballRadius,
    radius: ballRadius,
    velocity: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

// Ball Creation
function createBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff0000";
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
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
    ball.x = canvas.width / 2;
    ball.y = token.y - ballRadius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// Ball touching the wall
function ballTouchingWall() {
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = - ball.dx;
        hitWall.play();
    }

    if (ball.y - ball.radius < 0) {
        ball.dy = - ball.dy;
        hitWall.play();
    }

    if (ball.y + ball.radius > canvas.height) {
        playerLife--;
        loseLife.play();
        ballReset();
    }
}

// Ball touching the token
function ballTouchingToken() {
    if (ball.x < token.x + token.width && ball.x > token.x && token.y < token.y + token.height && ball.y > token.y) {

        hitToken.play();
        let touchPoint = ball.x - (token.x + token.width / 2);

        touchPoint = touchPoint / (token.width / 2);

        let touchAngle = touchPoint * Math.PI / 3;


        ball.dx = ball.velocity * Math.sin(touchAngle);
        ball.dy = - ball.velocity * Math.cos(touchAngle);
    }
}

// Ball touching Brick
function ballTouchingBrick() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = - ball.dy;
                    b.status = false;
                    hitBrick.play();
                }
            }
        }
    }
}

// Game Stats

function displayStatDescription(desc, descX, descY) {
    ctx.fillStyle = "#FFF";
    ctx.font = "20px Impact";
    ctx.fillText(desc, descX, descY);
}

function displayCurrentLevelAndLife(stat, statX, statY) {
    ctx.fillStyle = "#FFF";
    ctx.font = "20px Impact";
    ctx.fillText(stat, statX, statY);
}

// Game Over and Restart

function checkGameOver() {
    if(playerLife == -1){
        gameOver = true;
        playerGameOver();
        restartGame();
    }
}

function playerGameOver() {
    gameOverScreen.style.display = "block";
    restart.style.display = "block";
}

function restartGame() {
    restart.addEventListener("click", function(){
        location.reload();
    }
    )
}

function newLevel() {
    brokeAllBricks = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            brokeAllBricks = brokeAllBricks && ! bricks[r][c].status;
        }
    }
    if(brokeAllBricks) {
        
        outlineBricks();
        ball.velocity += 1;
        ballReset();
        currentLevel++;
    }
}


// Game Functions
function create() {

    createToken();

    createBall();

    createBricks();

    displayStatDescription("Level: ", 10, 25);
    displayCurrentLevelAndLife(currentLevel, 70, 25);

    
    displayStatDescription("Life: ", canvas.width -70, 25);
    displayCurrentLevelAndLife(playerLife, canvas.width -25, 25);


}

function update() {

    controlToken();

    controlBall();

    ballTouchingWall();

    ballTouchingToken();

    ballTouchingBrick();

    checkGameOver();

    newLevel();

}

// Game Loop
function loop() {

    ctx.drawImage(backgroundImage, 0, 0);
    //backgroundMusic.play();
    backgroundMusic.volume = 0.07;
    create();

    update();

    if(gameOver == false) {
    requestAnimationFrame(loop);
    }
}

loop();