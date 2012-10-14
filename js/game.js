(function(JE){
	function Game(cssSelector, hero, enemies) {
		this._canvas = jQuery(cssSelector);
		this._hero = hero;
		this._enemies = enemies || [];
		this._extras = [];
	}

	Game.prototype._bg = null;

	Game.prototype._canvas = null;

	Game.prototype._context = null;

	Game.prototype._hero = null;

	Game.prototype._enemies = null;

	Game.prototype._heroShadow = null;

	Game.prototype.started = false;

	Game.prototype.withEnemies = function(enemyArray) {
		this._enemies = enemyArray;
		return this;
	};

	Game.prototype.withEnemy = function(enemy) {
		this._enemies.push(enemy);
		return this;
	};

	Game.prototype.withHeroShadow = function(heroShadow) {
		this._heroShadow = heroShadow;
		return this;
	};

	Game.prototype.withExtras = function(extrasArray) {
		this._extras = extrasArray;
		return this;
	};

	Game.prototype.initialise = function() {
		this._hero.setY(Game.CHARACTER_START.Y);
		this._hero.setX(Game.CHARACTER_START.X);
	
		if (this._heroShadow) {
			this._heroShadow.setY(Game.SHADOW_START.Y);
			this._heroShadow.setX(Game.SHADOW_START.X);
		
			this._heroDifference = Game.CHARACTER_START.X - Game.SHADOW_START.X;
		}
	
		this._initialiseDom();
		this._initialiseEvents();
		return this;
	};

	Game.prototype._initialiseDom = function() {
		var canvas = this._canvas[0];
	
		this._context = canvas.getContext('2d');
	
		canvas.height = Game.HEIGHT;
		canvas.width = Game.WIDTH;
	
		this._audio = new Audio();
		if (Game.AUDIO && false) {
			this._audio.setAttribute("src", Game.AUDIO);
		}
	
		this._bgStart = new Image();
		this._bgStart.src = Game.BACKGROUND_START;
	
		this._bgX = Game.BACKGROUND_START_OFFSET;
		this._bg = new Image();
		this._bg.src = Game.BACKGROUND;
	
		this._createEnemies();
	
		this._createExtras();
	
		jQuery(this._bgStart).load(function() {
			this._context.drawImage(this._bgStart, 0, 0);
		}.bind(this));
	};

	Game.prototype._initialiseEvents = function() {
		jQuery(window).bind('keydown.game', this._handleKeyDown.bind(this))
				.bind('keyup.game', this._handleKeyUp.bind(this));
		
		
		// needs to be improved
		jQuery('#right').bind('mousedown.game, touchstart', this._handleKeyDown.bind(this, {keyCode: 39}))
						.bind('mouseup.game, touchend', this._handleKeyUp.bind(this, {keyCode: 39}));
		
		jQuery('#left').bind('mousedown.game, touchstart', this._handleKeyDown.bind(this, {keyCode: 37}))
						.bind('mouseup.game, touchend', this._handleKeyUp.bind(this, {keyCode: 37}));
		
		jQuery('#down').bind('mousedown.game, touchstart', this._handleKeyDown.bind(this, {keyCode: 40}))
						.bind('mouseup.game, touchend', this._handleKeyUp.bind(this, {keyCode: 40}));
						
		jQuery('#up').bind('mousedown.game, touchstart', this._handleKeyDown.bind(this, {keyCode: 38}))
						.bind('mouseup.game, touchend', this._handleKeyUp.bind(this, {keyCode: 38}));
					
		jQuery('#fire').bind('mousedown.game, touchstart', this._handleKeyDown.bind(this, {keyCode: 32}))
						.bind('mouseup.game, touchend', this._handleKeyUp.bind(this, {keyCode: 32}));
	};

	Game.prototype._handleKeyDown = function(jEvt) {
		var hero = this._hero;
		if (!this.started) {
			if (jEvt.keyCode == 32) {
				this.started = true;
				this._audio.play();
				this.loop();
			}
			return false;
		}
		if (hero.dying || this.paused) {
			return false; 
		}
	
		switch ( jEvt.keyCode ) {
			case 32: // space bar
				hero.punching = true;
			  	break;
	        case 37: // left
				if (!this.left) {
					hero.incrementX(Game.CHARACTER_WIDTH);
					this._setShadowX(Game.SHADOW_WIDTH);
				}
			  	this.left = true;
				hero.stopped = false;
	          	break;
	        case 39: // right
				if (this.left) {
					hero.incrementX(-Game.CHARACTER_WIDTH);
					this._setShadowX(-Game.SHADOW_WIDTH);
				}
	          	this.left = false;
				hero.stopped = false;
				break;
	        case 40: // down
				hero.crouching = true;
	          	break;
	      }
		  return false;
	};

	Game.prototype._handleKeyUp = function(jEvt) {
		var hero = this._hero;
		if (!this.started || hero.dying) {
			return false;
		}
	
		switch ( jEvt.keyCode ) {
			case 32: // space bar
				//hero.punching = true;
			  	break;
	        case 37: // left
				hero.stopped = true;
	          	break;
	        case 39: // right
				hero.stopped = true;
	          	break;
	        case 38: // up
				hero.jump();
				this.force = 3;
	          	break;
	        case 40: // down
				hero.crouching = false;
	          	break;
			case 80: // pause
				this.paused = !this.paused;
				if(!this.paused) {
					this.loop();
				}
	      }
		  return false;
	};

	Game.prototype._createEnemies = function() {
		this._enemies = this._enemies.map(function(obj) {
			var enemy = new obj.constructor();
			enemy.setX(obj.x);
			enemy.setY(obj.y);
			return enemy;
		}.bind(this));
	};

	Game.prototype._createExtras = function() {
		this._extras = this._extras.map(function(obj) {
			var extra = new obj.constructor();
			extra.setX(obj.x);
			extra.setY(obj.y);
			return extra;
		}.bind(this));
	};

	Game.prototype._renderEnemies = function() {
		var enemyFrame;
		this._enemies.forEach(function(enemy, index, array) {
			if (enemy.dead) {
				array.splice(index, 1);
				return;
			}
			enemyFrame = enemy.getCurrentFrame();
			enemy.incrementX(-0.6);
			this._context.drawImage(enemy.img, enemyFrame.x, enemyFrame.y, enemy.width, enemy.height, (enemy.x + this._bgX), enemy.y, enemy.width, enemy.height);
		}.bind(this));
	};

	Game.prototype._renderExtras = function() {
		var extraFrame;
		this._extras.forEach(function(extra, index, array) {
			var multiplyer = 1;
			extraFrame = extra.getCurrentFrame();
			extra.incrementX(-0.3);
			if (extra.left) {
				this._context.save();
				this._context.scale(-1, 1);
				multiplyer = -multiplyer;
			}
			this._context.drawImage(extra.img, extraFrame.x, extraFrame.y, extra.width, extra.height, (extra.x + this._bgX) * multiplyer, extra.y, extra.width, extra.height);
			if (extra.left) {
				this._context.restore(); // has own render?
			}
		}.bind(this));
	};

	Game.prototype._checkEnemiesHit = function() {
		var valueToCheck = this.left ? this._hero.x - this._bgX : this._hero.x - this._bgX + Game.CHARACTER_WIDTH;
		this._enemies.forEach(function(enemy, index, array) {
			if (enemy.isHit(valueToCheck)) {
				if (this._hero.punching) {
					enemy.dying = true;
				} else if (!enemy.dying){
					this._hero.dying = true;
					this._hero.stopped = true;
				}
			}
		}.bind(this));
	};

	Game.prototype._setShadowX = function(x) {
		if (this._heroShadow) {
			this._heroShadow.incrementX(x);
		}
	}

	Game.prototype.loop = function() {
		var hero = this._hero,
			heroShadow = this._heroShadow,
			bgEnd = -(this._bg.width - Game.BACKGROUND_END_OFFSET - Game.WIDTH),
			currentFrame, shadowFrame, dirX, dirShadowX;
	
		// clear
		this._context.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
	
		if (!hero.stopped) {
			hero.incrementX(this.left ? -Game.ACC : Game.ACC);
			if (heroShadow) {
				heroShadow.stopped = false;
				this._setShadowX(this.left ? -Game.ACC : Game.ACC);
			}
		} else {
			if (heroShadow) {
				heroShadow.stopped = true;
			}
		}
	
		if (hero.jumping) {
			this.force = this.force * (1 - Game.GRAVITY);
			hero.incrementY(-this.force);
		}
	
		if (hero.y < Game.JUMP_MAX) {
			hero.jumping = false;
			hero.falling = true;
			this.force = 2;
		}
	
		if (hero.falling) {
			this.force = this.force * (1 + Game.GRAVITY);
			hero.incrementY(this.force);
			if (hero.y > Game.CHARACTER_START.Y) {
				hero.setY(Game.CHARACTER_START.Y);
				hero.falling = false;
			}
		}
	
		// check all enemies
		this._checkEnemiesHit();
	
		if (!hero.stopped && (this._bgX * -1) + hero.x > (Game.WIDTH / 2) + Game.CHARACTER_WIDTH) {
			if (this.left) {
				if (hero.x < (Game.WIDTH / 2) + Game.CHARACTER_WIDTH) {
					this._bgX += Game.ACC;
					if (this._bgX < Game.BACKGROUND_START_OFFSET) {
						hero.incrementX(Game.ACC);
						this._setShadowX(Game.ACC);
					}
				}
			} else {
				if (hero.x >= (Game.WIDTH / 2) - (Game.CHARACTER_WIDTH / 2)) {
					this._bgX -= Game.ACC;
					if (this._bgX > bgEnd) {
						hero.incrementX(-Game.ACC);
						this._setShadowX(-Game.ACC);
					}
				}
			}
		} 
	
		if(hero.dying) {
			hero.incrementX(-1.8);
			this._setShadowX(-1.8);
			this._bgX += 3.6;
		}
	
		this._bgX = Math.max(Math.min(Game.BACKGROUND_START_OFFSET, this._bgX), bgEnd);
		this._context.drawImage(this._bg, 0, 0, this._bg.width, this._bg.height, this._bgX, 0, this._bg.width, this._bg.height);
	
		// contain in box (needs work)
		hero.setX(Math.max(Math.min(hero.x, (!this.left ? Game.WIDTH - Game.CHARACTER_WIDTH : Game.WIDTH)), (!this.left ? 0 : Game.CHARACTER_WIDTH)));
		// shadow?
	
	
		// get frame
		currentFrame = hero.getCurrentFrame();
	
		this._renderEnemies();
	
		this._context.save();
	
		if(this.left) {
		  this._context.scale(-1, 1);
		  dirX = (hero.x * -1);
		  if (heroShadow) {
		     dirShadowX = (heroShadow.x * -1);
	  	  }
		}
	
		this._context.drawImage(hero.img, currentFrame.x, currentFrame.y, hero.width, hero.height, dirX || hero.x, hero.y, hero.width, hero.height);

		if (heroShadow) {
			shadowFrame = heroShadow.getCurrentFrame();
			this._context.drawImage(heroShadow.img, shadowFrame.x, shadowFrame.y, heroShadow.width, heroShadow.height, dirShadowX || heroShadow.x, heroShadow.y, heroShadow.width, heroShadow.height);
		}
	
		this._context.restore();
	
	
		this._renderExtras();
	
		if (!this.paused) {
			setTimeout(this.loop.bind(this), 1000 / 70);
		}
	};

	Game.ACC = 1.6;

	Game.GRAVITY = 0.040;

	Game.BACKGROUND_START = '../img/title.gif';

	Game.BACKGROUND = '../img/gaulishvillage.png';

	Game.AUDIO = '../img/theme.mp3';

	Game.BACKGROUND_START_OFFSET = -40;

	Game.BACKGROUND_END_OFFSET = 38;

	Game.HEIGHT = 223;

	Game.WIDTH = 256;

	Game.CHARACTER_START = {
		X: 35,
		Y: 181
	};

	Game.SHADOW_START = {
		X: 5,
		Y: 183
	};

	Game.JUMP_MAX = 150;

	Game.CHARACTER_WIDTH = 26;

	Game.SHADOW_WIDTH = 23;
	
	JE.Game = Game;
}(window.JE));