
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var buttonRight = false;
var buttonLeft = false;
var position = document.getElementById("positions");
var score = 0;
var totalScore = 0;
var currentLevel = 0;

const level = {
    0: [1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        ],
    1: [1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1,
        ],
    2: [1, 1, 1, 1, 1, 1,
        0, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 0, 0,
        ],
    3: [0, 1, 1, 0, 1, 1,
        1, 0, 1, 1, 0, 1,
        1, 1, 0, 1, 1, 0,
        1, 1, 1, 0, 1, 1
        ]
}

const ball = { 
    x: canvas.width/2, //center
    y: canvas.height - 35, //px from the bottom
    dx: 5,
    dy: -5,
    radius: 5,
    speed: 5
}

//this.width reference not working, when fixed by get method the paddle motion function doesn't work?
const paddle = {
    height: 10,
    width: 80,
    pos: (canvas.width - 80) / 2
    // get pos() {
    //     return (canvas.width-this.width)/2;
    // }
}

const brick = {
    rows: 3,
    cols: 6,
    width: 80,
    height: 15,
    padding: 20,
}

//bricks objects array
var bricks = [];
console.log(level[currentLevel].length);

for (var i=1; i<=brick.cols; i++) {
    bricks[i] = [];
    for (var j=1; j<=level[currentLevel].length/brick.cols; j++) {
        bricks[i][j] = {x: 0, y: 0, hit: false};
    }
}

// Event handlers for the paddle
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Pushed key detection
function keyDownHandler(e) {
    if (e.keyCode == "39") {
        buttonRight = true;
    }
    else if (e.keyCode == "37") {
        buttonLeft = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == "39") {
        buttonRight = false;
    }
    else if (e.keyCode == "37") {
        buttonLeft = false;
    }
}

//detect brick hits and check if any left
function hitBricks() {
for (var i=1; i<=brick.cols; i++) {
    for (var j=1; j<=level[currentLevel].length/brick.cols; j++) {
        var currentBrick = bricks[i][j];
        if (currentBrick.hit == false) {
            if(ball.x + 5 > currentBrick.x && ball.x - 5 < currentBrick.x + brick.width && ball.y + 5 > currentBrick.y && ball.y - 5 < currentBrick.y + brick.height) {
                ball.dy = -ball.dy;
                currentBrick.hit = true;
                score++;
                if (score == level[currentLevel].length) {
                    console.log(score);
                    totalScore += score;
                    score = 0;
                    currentLevel++;
                    alert(`You win! Score: ${totalScore}. Click OK for next level`);    
                    document.location.reload();             
                }
            }
        }
    }
}
}

// Paddle, bricks and ball draw
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.pos, canvas.height-paddle.height-10, paddle.width, paddle.height);
    ctx.fillStyle = "darkolivegreen";
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.stroke();
    ctx.closePath();

}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "rgba(133, 55, 55, 0.8)";
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.stroke();
    ctx.closePath();
}

function drawBricks() {
    for (var i=1; i<=brick.cols; i++) {
        for (var j=1; j<=level[currentLevel].length/brick.cols; j++) {
            if (bricks[i][j].hit == false) {
                var brickX = (i*(brick.width + brick.padding)) - brick.width + 40;
                var brickY = (j*(brick.height + brick.padding)) - brick.height + 30;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brick.width, brick.height);
                ctx.fillStyle = "rgb(30, 100, 30)";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function motion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    hitBricks();

    // console.log(paddle.pos + ' ' + ball.x);

    position.innerHTML = "score: " + score;

    //Wall detection + direction change
    if(ball.x + ball.dx > canvas.width-ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx *= -1;
    }

    if (ball.y + ball.dy < ball.radius) {
        ball.dy *= -1;
    //hitting the bottom
    } else if (ball.y + ball.dy > canvas.height - ball.radius - 20) {
        if (ball.x > paddle.pos - 5 && ball.x < paddle.pos + paddle.width + 5) {
            ball.dy *= -1;
            ball.dy -= 0.1;
            ball.dx += 0.05;
        } else if (ball.y > canvas.height - 30) {
            document.location.reload();
        }
    
    }

    //paddle motion + wall detection
    if(buttonRight) {
        paddle.pos += 8;
        if (paddle.pos + paddle.width > canvas.width) {
            paddle.pos = canvas.width - paddle.width;
        }
    } else if (buttonLeft) {
        paddle.pos -= 8;
        if (paddle.pos < 0) {
            paddle.pos = 0;
        }
    }

    //ball motion
    ball.x += ball.dx;
    ball.y += ball.dy;
    requestAnimationFrame(motion);
}

    
motion();
    