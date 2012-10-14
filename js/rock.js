(function(JE) {
	function Rock(width, height, imgPath) {
		width = width || 19;
		height = height || 44;
		imgPath = imgPath || '../img/extra.png';
		Rock.superclass.constructor.call(this, width, height, imgPath);
	}

	JE.util.extend(Rock, JE.Piece);

	Rock.prototype.getCurrentFrame = function() {
		return {x: 326, y: 279};
	};

	Rock.prototype.incrementX = function(){};

	Rock.prototype.incrementY = function() {};
	
	JE.Rock = Rock;
}(window.JE));