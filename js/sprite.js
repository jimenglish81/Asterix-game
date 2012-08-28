function Sprite(width, height, frames) {
	this.width = width || 0;
	this.height = height || 0;
	this._frames = [];
	if (frames) {
		this.addAll(frames);
	}
}

Sprite.prototype._frames = null;

Sprite.prototype.height = null;

Sprite.prototype.width = null;

Sprite.prototype.addAll = function(frames) {
	for (var i = 0, l = frames.length; i < l; i++) {
		this.add(frames[i].name, frames[i].x, frames[i].y);
	}
};

Sprite.prototype.add = function(name, x, y) {
	this._frames.push({
		position: this._frames.length,
		x: x,
		y: y,
		name: name
	});
};

Sprite.prototype.findByName = function(name) {
	var current;
	for (var i = 0, l = this._frames.length; i < l; i++) {
		current = this._frames[i];
		if (this._frames[i].name == name) {
			return this._frames[i];
		} 
	}
	return false;
};

Sprite.prototype.getOffset = function(name) {
	var sprite = this.findByName(name);
	return {
		x: sprite.x || this.width * sprite.position,
		y: sprite.y || 0,
		width: this.width,
		height: this.height
	}; 
};