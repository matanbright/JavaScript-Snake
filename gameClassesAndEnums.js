var Direction = {
	none: 0,
	left : 1,
	up : 2,
	right : 3,
	down : 4
};

var Key = {
	left : 37,
	up : 38,
	right : 39,
	down : 40
};

class LocationIndex {
	constructor(xIndex, yIndex) {
		this.xIndex = xIndex;
		this.yIndex = yIndex;
	}
}

class Size {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
}

class Speed {
	constructor(xSpeed, ySpeed) {
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
	}
}

class SnakeSegment {
	constructor(locationIndex, nextMovementDirection, color) {
		this.locationIndex = locationIndex;
		this.nextMovementDirection = nextMovementDirection;
		this.color = color;
	}
	
	draw(canvasContext) {
		canvasContext.beginPath();
		canvasContext.rect(
			this.locationIndex.xIndex * SNAKE_SEGMENTS_SIZE,
			this.locationIndex.yIndex * SNAKE_SEGMENTS_SIZE,
			SNAKE_SEGMENTS_SIZE,
			SNAKE_SEGMENTS_SIZE
		);
		canvasContext.strokeStyle = this.color;
		canvasContext.fillStyle = this.color;
		canvasContext.stroke();
		canvasContext.fill();
	}
	
	nextMove(canvas) {
		if ((this.nextMovementDirection == Direction.right && this.locationIndex.xIndex + 1 >= (canvas.width / SNAKE_SEGMENTS_SIZE)) ||
		   (this.nextMovementDirection == Direction.left && this.locationIndex.xIndex - 1 < 0) ||
		   (this.nextMovementDirection == Direction.down && this.locationIndex.yIndex + 1 >= (canvas.height / SNAKE_SEGMENTS_SIZE)) ||
		   (this.nextMovementDirection == Direction.up && this.locationIndex.yIndex - 1 < 0))
			return false;
		switch (this.nextMovementDirection) {
			case Direction.left:
				this.locationIndex.xIndex--;
				break;
			case Direction.up:
				this.locationIndex.yIndex--;
				break;
			case Direction.right:
				this.locationIndex.xIndex++;
				break;
			case Direction.down:
				this.locationIndex.yIndex++;
				break;
		}
		return true;
	}
}

class Snake {
	constructor(initialLocationIndex, segmentsSize, segmentsColor) {
		this.segmentsSize = segmentsSize;
		this.segmentsColor = segmentsColor;
		this.segments = [
			new SnakeSegment(new LocationIndex(initialLocationIndex.xIndex, initialLocationIndex.yIndex), Direction.none, this.segmentsColor)
		];
	}
	
	draw(canvasContext) {
		for (var i = this.segments.length - 1; i >= 0; i--)
			this.segments[i].draw(canvasContext);
	}
	
	nextMove(canvas) {
		for (var i = this.segments.length - 1; i >= 0; i--)
			if (!this.segments[i].nextMove(canvas))
				return false;
		for (var i = 0; i < this.segments.length - 1; i++)
			this.segments[i].nextMovementDirection = this.segments[i + 1].nextMovementDirection;
		return true;
	}
	
	changeMovementDirection(direction) {
		if (!((this.segments[this.segments.length - 1].nextMovementDirection == Direction.left && direction == Direction.right) ||
		   (this.segments[this.segments.length - 1].nextMovementDirection == Direction.up && direction == Direction.down) ||
		   (this.segments[this.segments.length - 1].nextMovementDirection == Direction.right && direction == Direction.left) ||
		   (this.segments[this.segments.length - 1].nextMovementDirection == Direction.down && direction == Direction.up)))
			this.segments[this.segments.length - 1].nextMovementDirection = direction;
	}
	
	addSegment() {
		this.segments.unshift(
			new SnakeSegment(new LocationIndex(this.segments[0].locationIndex.xIndex, this.segments[0].locationIndex.yIndex), Direction.none, this.segmentsColor)
		);
	}
	
	isSnakeEatsFood(food) {
		return (this.segments[this.segments.length - 1].locationIndex.xIndex == food.locationIndex.xIndex &&
		   this.segments[this.segments.length - 1].locationIndex.yIndex == food.locationIndex.yIndex);
	}
	
	isSnakeEatsItself() {
		for (var i = 0; i < this.segments.length - 1; i++)
			if (this.segments[this.segments.length - 1].locationIndex.xIndex == this.segments[i].locationIndex.xIndex &&
			   this.segments[this.segments.length - 1].locationIndex.yIndex == this.segments[i].locationIndex.yIndex &&
			   this.segments[0].nextMovementDirection != Direction.none)
				return true;
		return false;
	}
	
	isLocationIndexOccupiedBySnake(locationIndex) {
		for (var i = 0; i < this.segments.length; i++)
			if (this.segments[i].locationIndex.xIndex == locationIndex.xIndex &&
			   this.segments[i].locationIndex.yIndex == locationIndex.yIndex)
				return true;
		return false;
	}
}

class Food {
	constructor(locationIndex, color) {
		this.locationIndex = locationIndex;
		this.color = color;
	}
	
	draw(canvasContext) {
		canvasContext.beginPath();
		canvasContext.rect(
			this.locationIndex.xIndex * SNAKE_SEGMENTS_SIZE,
			this.locationIndex.yIndex * SNAKE_SEGMENTS_SIZE,
			SNAKE_SEGMENTS_SIZE,
			SNAKE_SEGMENTS_SIZE
		);
		canvasContext.strokeStyle = this.color;
		canvasContext.fillStyle = this.color;
		canvasContext.stroke();
		canvasContext.fill();
	}
}
