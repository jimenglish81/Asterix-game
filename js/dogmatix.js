(function(JE) {
	function Dogmatix(width, height, imgPath) {
		width = width || 23;
		height = height || 31;
		imgPath = imgPath || '../img/dogmatix.png';
		Dogmatix.superclass.constructor.call(this, width, height, imgPath);
		
		this.stopped = false;
	}
	
	JE.util.extend(Dogmatix, JE.Piece);

	Dogmatix.prototype._setUpSpriteSheet = function() {
		this._spriteSheet = new JE.Sprite(this.width, this.height,[
			{ name: 'standing', x: 17, y: 48 },
			{ name: 'walk_1', x: 3, y: 7 },
			{ name: 'walk_2', x: 26, y: 6 },
			{ name: 'walk_3', x: 56, y: 8 },
			{ name: 'walk_4', x: 81, y: 5 },
			{ name: 'walk_5', x: 107, y: 7 }
		]);
	};

	Dogmatix.prototype._setUpAnimations = function() {
		this._walkAnimation = new JE.Animation([
		    { sprite: 'walk_1', time: 0.15 },
		    { sprite: 'walk_2', time: 0.15 },
		    { sprite: 'walk_3', time: 0.15 },
		    { sprite: 'walk_4', time: 0.15 },
		    { sprite: 'walk_5', time: 0.15 }
		], this._spriteSheet);
	};

	Dogmatix.prototype.getCurrentFrame = function() {
		var frame;
	
		if (this.stopped) {
			frame = this._spriteSheet.findByName('standing');
		} else {
			frame = this._walkAnimation.getSprite();
			this._walkAnimation.animate(this.timer.getSeconds());
			this.timer.tick();
		}

		return frame;
	};

	JE.Dogmatix = Dogmatix;
}(window.JE));