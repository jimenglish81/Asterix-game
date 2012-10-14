(function(JE) {
	function Bird(width, height, imgPath) {
		width = width || 16;
		height = height || 24;

		imgPath = imgPath || '../img/romans.png';
		Bird.superclass.constructor.call(this, width, height, imgPath);
	
		this.left = true;
	}
	
	JE.util.extend(Bird, JE.Piece);

	Bird.prototype._flyAnimation = null;

	Bird.prototype._setUpSpriteSheet = function() {
		this._spriteSheet = new JE.Sprite(this.width, this.height,[
			{ name: 'fly_1', x: 379, y: 290 },
			{ name: 'fly_2', x: 403, y: 291 },
			{ name: 'fly_3', x: 427, y: 296 },
			{ name: 'fly_4', x: 451, y: 296 }
		]);
	};

	Bird.prototype._setUpAnimations = function() {
		this._flyAnimation = new JE.Animation([
		    { sprite: 'fly_1', time: 0.15 },
		    { sprite: 'fly_2', time: 0.15 },
		    { sprite: 'fly_3', time: 0.15 },
		    { sprite: 'fly_4', time: 0.15 }
		], this._spriteSheet);
	};

	Bird.prototype.getCurrentFrame = function() {
		var frame = this._flyAnimation.getSprite();
	
		this._flyAnimation.animate(this.timer.getSeconds());
		this.timer.tick();

		return frame;
	};
	
	JE.Bird = Bird;
}(window.JE));
