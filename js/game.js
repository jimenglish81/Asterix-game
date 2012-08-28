function Game(id, timer, animation, punchAnimation, jumpAnimation) {
	this._timer = timer;
	this._timer.tick();
	this.stopped = true;
	this._animation = animation;
	this._punchAnimation = punchAnimation;
	this._jumpAnimation = jumpAnimation;
	this._dirX = 0;
	this._dirY = 180;
	
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
			if (!this.left) {
				this._dirX += 26;
			}
		    this.left = true;
			this.stopped = false;
	          break;
	        case 39: // right
			if (this.left) {
				this._dirX -= 26;
			}
		      this.left = false;
			  this.stopped = false;
	          break;
	        case 38: // up
	          // jump
	          break;
	        case 40: // down
			  this.crouch = true;
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
			case 32: // space bar
			  this.punch = true;
	        case 37: // left
	          this.stopped = true;
	          break;
	        case 39: // right
	          this.stopped = true;
	          break;
	        case 38: // up
	          this.jump = true;
	          break;
	        case 40: // down
			  this.crouch = false;
	          // crouch
	          break;
	      }
	    }.bind(this),
	    false
	  );
};

Game.prototype.loop = function() {
	var special, dir;
	this._context.clearRect(0, 0, 800, 300);
	this._context.drawImage(this._bg, 0, 0, 256, 223);
	
	if (this.punch) {
		currentFrame = this._punchAnimation.getSprite();
		special = this._punchAnimation.animate(this._timer.getSeconds());
		this.punch = !!special;
		this._timer.tick();
		
		if (!special) {
			this._punchAnimation.reset();
			this._animation.reset();
		}
	} else if (this.crouch) {
		this._animation.reset();
		currentFrame = {
			x: 111,
			y: 51
		};
	} else if (!this.stopped) {
		currentFrame = this._animation.getSprite();
		this._animation.animate(this._timer.getSeconds());
		this._timer.tick();
		this._dirX = this.left ? this._dirX - 1 : this._dirX + 1;
	} else {
		this._animation.reset();
		currentFrame = {
			x: 9,
			y: 50
		};
	}
	this._context.fill();
	this._context.save();
	if(this.left) {
	  this._context.scale(-1, 1);
	  dir = (this._dirX * -1);
	} else {
	  dir = this._dirX;
	}
	this._context.drawImage(this._img, currentFrame.x, currentFrame.y, 26, 32, dir, this._dirY, 26, 32);
	this._context.restore();

	setTimeout(this.loop.bind(this), 1000 / 60);
};