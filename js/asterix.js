(function(JE) {
	function Asterix(width, height, imgPath) {
		width = width || 26;
		height = height || 32;
		imgPath = imgPath || '../img/asterix.gif';
		Asterix.superclass.constructor.call(this, width, height, imgPath);
	
		this.stopped = true;
	}

	JE.util.extend(Asterix, JE.Piece);

	Asterix.prototype.stopped = null;

	Asterix.prototype.jumping = null;

	Asterix.prototype.crouching = null;

	Asterix.prototype._walkAnimation = null;

	Asterix.prototype._punchAnimation = null;

	Asterix.prototype._fallAnimation = null;

	Asterix.prototype._setUpSpriteSheet = function() {
		this._spriteSheet = new JE.Sprite(this.width, this.height,[
			{ name: 'walk_1', x: 177, y: 5 },
			{ name: 'walk_2', x: 10, y: 5 },
			{ name: 'walk_3', x: 44, y: 5 },
			{ name: 'walk_4', x: 78, y: 5 },
			{ name: 'walk_5', x: 109, y: 5 },
			{ name: 'walk_6', x: 145, y: 5 },
			{ name: 'punch_1', x: 163, y: 50 },
			{ name: 'punch_2', x: 211, y: 50 },
			{ name: 'punch_3', x: 249, y: 47 },
			{ name: 'jump_1', x: 11, y: 100 },
			{ name: 'jump_2', x: 47, y: 98 },
			{ name: 'standing', x: 9, y: 50},
			{ name: 'crouching', x: 153, y: 154},
			{ name: 'fall', x: 214, y: 136}
		]);
	};

	Asterix.prototype._setUpAnimations = function() {
		this._walkAnimation = new JE.Animation([
		    { sprite: 'walk_1', time: 0.15 },
		    { sprite: 'walk_2', time: 0.15 },
			{ sprite: 'walk_3', time: 0.15 },
			{ sprite: 'walk_4', time: 0.15 },
			{ sprite: 'walk_5', time: 0.15 },
			{ sprite: 'walk_6', time: 0.15 }
		], this._spriteSheet);
	
		this._punchAnimation = new JE.Animation([
		    { sprite: 'punch_1', time: 0.15 },
		    { sprite: 'punch_2', time: 0.15 },
			{ sprite: 'punch_3', time: 0.15 }
		], this._spriteSheet, true);
	
		this._fallAnimation = new JE.Animation([
		    { sprite: 'fall', time: 0.25 }
		], this._spriteSheet, true);
	};

	Asterix.prototype.getCurrentFrame = function() {
		var frame, special;
	
		if (!this.stopped) {
			frame = this._walkAnimation.getSprite();
			this._walkAnimation.animate(this.timer.getSeconds());
			this.timer.tick();
		} else {
			this._walkAnimation.reset();
			frame = this._spriteSheet.findByName('standing');
		}
	
		if (this.crouching && !this.falling && !this.jumping) {
			this._walkAnimation.reset();
			frame = this._spriteSheet.findByName('crouching');
		}
	
		if (this.jumping) {
			frame = this._spriteSheet.findByName('jump_1');
		}

		if (this.y < 150) {
			this.jumping = false;
			this.falling = true;
		}
	
		if (this.falling) {
			frame = this._spriteSheet.findByName('jump_2');
		}
	
		if (this.punching) {
			frame = this._punchAnimation.getSprite();
			special = this._punchAnimation.animate(this.timer.getSeconds());
			this.punching = !!special;
			this.timer.tick();
		
			if (!special) {
				this._punchAnimation.reset();
				this._walkAnimation.reset();
			}
		}
	
		if (this.dying) {
			frame = this._fallAnimation.getSprite();
			special = this._fallAnimation.animate(this.timer.getSeconds());
			this.dying = !!special;
			this.timer.tick();
			if (!special) {
				this._walkAnimation.reset();
				this._fallAnimation.reset();
				this.dying = false;
			} 
		}
	
		return frame;
	};

	Asterix.prototype.jump = function() {
		if (!this.falling) {
			this.jumping = true;
		  	this.falling = false;
		}
	};
	
	JE.Asterix = Asterix;
}(window.JE));