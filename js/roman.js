(function(JE) {
	function Roman(width, height, imgPath) {
		width = width || 30;
		height = height || 46;
		imgPath = '../img/romans.png';
		
		Roman.superclass.constructor.call(this, width, height, imgPath);
		this.dead = false;
	}

	JE.util.extend(Roman, JE.Piece);
	
	Roman.prototype.dead = null;
	
	Roman.prototype.dying = null;
	
	Roman.prototype._walkAnimation = null;
	
	Roman.prototype._fallAnimation = null;
	
	Roman.prototype._setUpSpriteSheet = function() {
		this._spriteSheet = new JE.Sprite(this.width, this.height,[
			{ name: 'walk_1', x: 75, y: 2 },
			{ name: 'walk_2', x: 116, y: 0 },
			{ name: 'walk_3', x: 155, y: 2 },
			{ name: 'fall_1', x: 368, y: 0 },
			{ name: 'fall_2', x: 407, y: 10 }
		]);
	};

	Roman.prototype._setUpAnimations = function() {
		this._walkAnimation = new JE.Animation([
		    { sprite: 'walk_1', time: 0.15 },
		    { sprite: 'walk_2', time: 0.15 },
		    { sprite: 'walk_3', time: 0.15 }
		], this._spriteSheet);
	
		this._fallAnimation = new JE.Animation([
		    { sprite: 'fall_1', time: 0.15 },
		    { sprite: 'fall_2', time: 0.15 }
		], this._spriteSheet, true);
	
	};

	Roman.prototype.getCurrentFrame = function() {
		var frame;
	
		if (this.dying) {
			frame = this._fallAnimation.getSprite();
			special = this._fallAnimation.animate(this.timer.getSeconds());
			this.dead = !special;
			this.timer.tick();
		} else {
			frame = this._walkAnimation.getSprite();
			this._walkAnimation.animate(this.timer.getSeconds());
			this.timer.tick();
		}

		return frame;
	};

	Roman.prototype.isHit = function(x) {
		// 0.5 threshold?
		return this.x > Math.floor(x-this.width) && this.x < Math.ceil(x+0.5);
	}
	
	JE.Roman = Roman;
}(window.JE));