function Game(id, timer, animation, punchAnimation, jumpAnimation) {
	this._timer = timer;
	this._timer.tick();
	this.stopped = true;
	this._animation = animation;
	this._punchAnimation = punchAnimation;
	this._jumpAnimation = jumpAnimation;
	this._dirX = 0;
	this._dirY = 181;
	this._bgX = -40;
	
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
	
	this._bg.src = '../img/gaulishvillage.png';
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
			  if (!this.falling) {
	          	this.jumping = true;
			  	this.falling = false;
				this._force = 2;
		  	  }
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
	this._context.clearRect(0, 0, 300, 300);
	
	if (this.punch) {
		currentFrame = this._punchAnimation.getSprite();
		special = this._punchAnimation.animate(this._timer.getSeconds());
		this.punch = !!special;
		this._timer.tick();
		
		if (!special) {
			this._punchAnimation.reset();
			this._animation.reset();
		}
	} else if (this.crouch && !this.falling && !this.jumping) {
		this._animation.reset();
		currentFrame = {
			x: 153,
			y: 155
		};
	} else if (!this.stopped) {
		currentFrame = this._animation.getSprite();
		this._animation.animate(this._timer.getSeconds());
		this._timer.tick();
		this._dirX = this.left ? this._dirX - 0.4 : this._dirX + 0.4;
	} else if (!this.jumping && !this.falling) {
		this._animation.reset();
		currentFrame = {
			x: 9,
			y: 50
		};
	}
	
	if (this.jumping) {
		this._force = (this._force * 0.975);
		this._dirY -= this._force;
		currentFrame = {
			x: 11,
			y: 100
		};
	}
	
	if (this._dirY < 150) {
		this.jumping = false;
		this.falling = true;
		this._force = 1;
	}
	
	if (this.falling) {
		this._force = (this._force * 1.025);
		this._dirY += (this._force);
		currentFrame = {
			x: 47,
			y: 98
		};
	}
	
	if (this._dirY >= 181) {
		this.falling = false;
		this._dirY = 181;
	}
	
	// collision detection
	this._dirX = Math.max(Math.min(this._dirX , 230), 26);
	
	  if (!this.left && !this.stopped) {
		this._bgX -= 1;
	  } else if (this.left  && !this.stopped) {
		this._bgX += 1;
	  }
	
	this._bgX = Math.max(Math.min(-40, this._bgX), -1366);
	
	this._context.drawImage(this._bg, 0, 0, 1660, 223, this._bgX, 0, 1660, 223);
	
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