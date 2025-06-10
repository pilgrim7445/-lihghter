const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_MARGIN = 18;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 5; // AI paddle speed

// Game objects
let player = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0
};

let ai = {
    x: canvas.width - PADDLE_WIDTH - PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: BALL_RADIUS,
    speed: 6,
    velocityX: 6 * (Math.random() > 0.5 ? 1 : -1),
    velocityY: 4 * (Math.random() > 0.5 ? 1 : -1)
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y) {
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.fillText(text, x, y);
}

// Mouse movement for player paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    // Center paddle on mouse
    player.y = mouseY - player.height / 2;
    // Clamp paddle inside canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.velocityY = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
}

// Collision detection
function collision(b, p) {
    return (
        b.x + b.radius > p.x && 
        b.x - b.radius < p.x + p.width &&
        b.y + b.radius > p.y &&
        b.y - b.radius < p.y + p.height
    );
}

// Update function
function update() {
    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.velocityY *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.velocityY *= -1;
    }

    // Check collision with player
    if (collision(ball, player)) {
        ball.x = player.x + player.width + ball.radius;
        ball.velocityX *= -1;
        // Add randomness to direction
        ball.velocityY += (Math.random() - 0.5) * 2;
    }

    // Check collision with AI
    if (collision(ball, ai)) {
        ball.x = ai.x - ball.radius;
        ball.velocityX *= -1;
        // Add randomness
        ball.velocityY += (Math.random() - 0.5) * 2;
    }

    // Score update
    if (ball.x - ball.radius < 0) {
        ai.score++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }

    // AI movement (simple tracking)
    if (ai.y + ai.height / 2 < ball.y - 10) {
        ai.y += PADDLE_SPEED;
    } else if (ai.y + ai.height / 2 > ball.y + 10) {
        ai.y -= PADDLE_SPEED;
    }
    // Clamp AI paddle
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Render function
function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height, "#fff");
    drawRect(ai.x, ai.y, ai.width, ai.height, "#fff");

    // Draw net
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, "#888");
    }

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, "#fff");

    // Draw scores
    drawText(player.score, canvas.width / 4, 50);
    drawText(ai.score, 3 * canvas.width / 4, 50);
}

// Main game loop
function game() {
    update();
    render();
    requestAnimationFrame(game);
}

// Start game
game();
