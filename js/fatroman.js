(function(JE) {
	function FatRoman(width, height, imgPath) {
		width = 32;
		height = 47;
		FatRoman.superclass.constructor.call(this, width, height, imgPath);
	}

	JE.util.extend(FatRoman, JE.Roman);

	FatRoman.prototype._setUpSpriteSheet = function() {
		this._spriteSheet = new JE.Sprite(this.width, this.height,[
			{ name: 'walk_1', x: 251, y: 73 },
			{ name: 'walk_2', x: 292, y: 72 },
			{ name: 'walk_3', x: 333, y: 73 },
			{ name: 'walk_4', x: 372, y: 72 },
			{ name: 'fall_1', x: 495, y: 72 },
			{ name: 'fall_2', x: 531, y: 74 }
		]);
	};

	FatRoman.prototype._setUpAnimations = function() {
		this._walkAnimation = new JE.Animation([
		    { sprite: 'walk_1', time: 0.15 },
		    { sprite: 'walk_2', time: 0.15 },
		    { sprite: 'walk_3', time: 0.15 },
		    { sprite: 'walk_4', time: 0.15 }
		], this._spriteSheet);
	
		this._fallAnimation = new JE.Animation([
		    { sprite: 'fall_1', time: 0.15 },
		    { sprite: 'fall_2', time: 0.15 }
		], this._spriteSheet, true);
	
	};
	
	JE.FatRoman = FatRoman;
}(window.JE));