(function(JE) {
	function Piece(width, height, imgPath) {
		this.timer = new JE.Timer();
		this.timer.tick();

		this.width = width;
		this.height = height;

		this.img = new Image();
		this.img.src = imgPath;
		this._setUpSpriteSheet();
		this._setUpAnimations();
	}
	
	Piece.prototype.timer = null;
	
	Piece.prototype.width = null;
	
	Piece.prototype.height = null;
	
	Piece.prototype.img = null;
	
	Piece.prototype._spriteSheet = null;
	
	Piece.prototype._setUpSpriteSheet = function() {};
	
	Piece.prototype._setUpAnimations = function() {};
	
	Piece.prototype.getCurrentFrame = function() {};
		
	Piece.prototype.setX = function(x) {
		this.x = x;
	};

	Piece.prototype.setY = function(y) {
		this.y = y;
	};
	
	Piece.prototype.incrementX = function(x) {
		this.x += x;
	};
	
	Piece.prototype.incrementY = function(y) {
		this.y += y;
	};
	
	JE.Piece = Piece;
}(window.JE));