function Timer() {
    this._lastTick = (new Date()).getTime();
};
 
Timer.prototype._lastTick = null;

Timer.prototype._spacing = null;

Timer.prototype.getSeconds = function() {
	return (this._spacing / 1000) || 0;
};
 
Timer.prototype.tick = function() {
    var currentTick = (new Date()).getTime();
	this._spacing = currentTick - this._lastTick;
    this._lastTick = currentTick;
};