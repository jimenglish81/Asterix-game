function Animation(frames, sprite, once) {
	this._sprite = sprite;
	this._frames = frames || [];
	this._once = !!once;
	this._initialise();
}

Animation.prototype._duration - null;

Animation.prototype._frameIndex - null;

Animation.prototype._frames - null;

Animation.prototype._sprite - null;

Animation.prototype._initialise = function() {
	this.reset();
};

Animation.prototype.reset = function() {
	this._frameIndex = 0;
	this._duration = this._frames[0] ? this._frames[0].time : 0;
};

Animation.prototype.animate = function(time) {
	this._duration -= time;
	if (this._duration <= 0) {
        this._frameIndex++;
        if(this._frameIndex == this._frames.length) {
			if (this._once) {
				return false;
			} 
            this._frameIndex = 0;
        }

        this._duration = this._frames[this._frameIndex].time;
	}
	return true;
};

Animation.prototype.getSpriteIndex = function() {
	return this._frameIndex;
};

Animation.prototype.getSprite = function() {
	return this._sprite.getOffset(this._frames[this._frameIndex].sprite);
};
