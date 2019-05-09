var canvas = document.getElementById("canvas_gameCanvas");
var canvasContext = canvas.getContext("2d");
var snake = new Snake(new LocationIndex(INITIAL_SNAKE_X_INDEX, INITIAL_SNAKE_Y_INDEX), SNAKE_SEGMENTS_SIZE, SNAKE_SEGMENTS_COLOR);
var food = new Food(new LocationIndex(0, 0), FOOD_COLOR);
var snakeMovementInQueue = false;
var gameInProgress = false;
var gameOver = false;


window.onload = function() {
	if (canvas.width % SNAKE_SEGMENTS_SIZE != 0)
		canvas.width -= (canvas.width % SNAKE_SEGMENTS_SIZE);
	if (canvas.height % SNAKE_SEGMENTS_SIZE != 0)
		canvas.height -= (canvas.height % SNAKE_SEGMENTS_SIZE);
	
	moveFood();
	food.draw(canvasContext);
	snake.draw(canvasContext);
};

window.setInterval(function() {
	if (gameInProgress && !gameOver) {
		if (!snake.nextMove(canvas))
			endGame();
		else {
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			food.draw(canvasContext);
			snake.draw(canvasContext);
			snakeMovementInQueue = false;
			if (snake.isSnakeEatsFood(food)) {
				moveFood();
				snake.addSegment();
			}
			if (snake.isSnakeEatsItself())
				endGame();
		}
	}
}, SNAKE_MOVEMENT_TIMER_INTERVAL);

window.onkeydown = function() {
	if (!gameOver && !snakeMovementInQueue) {
		switch (event.keyCode) {
			case Key.left:
				gameInProgress = true;
				snake.changeMovementDirection(Direction.left);
				snakeMovementInQueue = true;
				break;
			case Key.up:
				gameInProgress = true;
				snake.changeMovementDirection(Direction.up);
				snakeMovementInQueue = true;
				break;
			case Key.right:
				gameInProgress = true;
				snake.changeMovementDirection(Direction.right);
				snakeMovementInQueue = true;
				break;
			case Key.down:
				gameInProgress = true;
				snake.changeMovementDirection(Direction.down);
				snakeMovementInQueue = true;
				break;
		}
	}
};

function moveFood() {
	do
		food.locationIndex = new LocationIndex(getRandomNumber(0, (canvas.width / SNAKE_SEGMENTS_SIZE)), getRandomNumber(0, (canvas.height / SNAKE_SEGMENTS_SIZE)));
	while (snake.isLocationIndexOccupiedBySnake(food.locationIndex));
}

function endGame() {
	gameInProgress = false;
	gameOver = true;
	window.alert("Game over!");
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min - 1)) + min;
}
