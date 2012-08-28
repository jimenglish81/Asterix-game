function Game(id, timer, animation) {
	this._timer = timer;
	this._timer.tick();
	this.stopped = true;
	this._animation = animation;
	this._dirX = 0;
	
	this._initialiseDom(id);
	this._initialiseEvents();
	
	this.loop();
}

Game.prototype._initialiseDom = function(id) {
	this._img = new Image();
	this._bg = new Image();
	
	this._canvas = document.getElementById(id),
	this._context = this._canvas.getContext('2d');
	
	this._canvas.height = 223;
	this._canvas.width = 256;
	
	this._bg.src = '../img/002.png';
	this._img.src = '../img/asterix.gif';
	this._bg.onload = function() {
		this.loop();
	}.bind(this);
};

Game.prototype._initialiseEvents = function() {
	window.addEventListener(
	    'keydown',
	    function(evt) {
	      var key = (evt.which) ? evt.which : evt.keyCode;
	      switch ( key ) {
	        case 37: // left
			// mygame.stopped = false;
	          break;
	        case 39: // right
			  this.stopped = false;
	          break;
	        case 38: // up
	          // jump
	          break;
	        case 40: // down
	          // crouch
	          break;
	      }
	    }.bind(this),
	    false
	  );

	window.addEventListener(
	    'keyup',
	    function(evt) {
	      var key = (evt.which) ? evt.which : evt.keyCode;
	      switch ( key ) {
	        case 37: // left
	          this.stopped = true;
	          break;
	        case 39: // right
	          this.stopped = true;
	          break;
	        case 38: // up
	          // jump
	          break;
	        case 40: // down
	          // crouch
	          break;
	      }
	    }.bind(this),
	    false
	  );
};

Game.prototype.loop = function() {
	this._context.clearRect(0, 0, 800, 300);
	this._context.drawImage(this._bg, 0, 0, 256, 223);
	
	if (!this.stopped) {
		currentFrame = this._animation.getSprite();
		this._animation.animate(this._timer.getSeconds());
		this._timer.tick();
		this._dirX += 1;
	} else {
		this._animation.reset();
		currentFrame = {
			x: 9,
			y: 50
		};
	}

	this._context.drawImage(this._img, currentFrame.x, currentFrame.y, 26, 32, this._dirX, 180, 26, 32);
	this._context.fill();
	setTimeout(this.loop.bind(this), 1000 / 60);
};