// Background settings
function Background() {
	this.fps = 30;
	this.canvas = null;
	this.width = 800;
	this.height = 600;
	this.minVelocity = 50;
	this.maxVelocity = 80;
	this.asteroids = 100;
	this.intervalId = 0;
}

//Draw background canvas.
Background.prototype.initialise = function(div) {
	var self = this; //Avoid aliasing.

	//	Create a window div.
	this.containerDiv = div;
	self.width = window.innerWidth;
	self.height = window.innerHeight;

	window.onresize = function(event) {
		self.width = window.innerWidth;
		self.height = window.innerHeight;
		self.canvas.width = self.width;
		self.canvas.height = self.height;
		self.draw();
 	}

	//	Create the canvas and put inside div.
	var canvas = document.createElement('canvas');
	canvas.setAttribute("id", "backgroundCanvas");
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

Background.prototype.start = function() {

	//	Create the background asteroids.
	var asteroids = [];
	for(var i=0; i<this.asteroids; i++) {
		asteroids[i] = new Asteroid(Math.random()*this.width, Math.random()*this.height, Math.random()*10+1,
		 (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.asteroids = asteroids;

	var self = this;
	//	Start the timer.
	this.intervalId = setInterval(function() {
		self.update();
		self.draw();	
	}, 1000 / this.fps);
};

Background.prototype.stop = function() {
	clearInterval(this.intervalId);
};

Background.prototype.update = function() {
	var dt = 1 / this.fps;

	for(var i=0; i<this.asteroids.length; i++) {
		var asteroid = this.asteroids[i];
		asteroid.x += dt * asteroid.velocity;
		//	If the asteroid has moved from the bottom of the screen, spawn it at the top.
		if(asteroid.x > this.width) {
			this.asteroids[i] = new Asteroid(0, Math.random()*this.width, Math.random()*10+1, 
		 	(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
};

Background.prototype.draw = function() {

	//	Get the canvas.
	var back = document.getElementById("bkCanvas");
	var ctx = this.canvas.getContext("2d");

	//	Add a black background.
 	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, this.width, this.height);

	//	Overlay asteroids onto canvas.
	var asteroidImage = document.getElementById('asteroid');
	
	for(var i=0; i<this.asteroids.length;i++) {
		var ast = this.asteroids[i];
		ctx.drawImage(asteroidImage, ast.x, ast.y, ast.size, ast.size);
	}
};
