var Shadow = me.SpriteObject.extend({
	init: function(x, y) {
		image = me.loader.getImage("effect-shadow");
		this.parent(x, y, image, 32, 16);
	}
});

var Explosion = me.AnimationSheet.extend({
	init: function(x, y) {
		image = me.loader.getImage("effect-explosion");
		this.parent(x, y, image, 32, 32);
		this.animationspeed = me.sys.fps / 20;
		this.addAnimation("explosion", [0,1,2,3,4,5]);
		this.addAnimation("finished", [6]);
		this.setCurrentAnimation("explosion", function(){this.setCurrentAnimation("finished",me.game.remove(this));});
		me.audio.play("explosionsound");
	}
});