var PlayerEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {
	
		settings.image = "player";
		settings.spritewidth = 32;
		settings.spriteheight = 64;
		
		this.parent(x, y, settings);

		this.setVelocity(2, 2);
		this.gravity = 0;
		
		this.collidable = true;
		
		this.updateColRect(4, 26, 56, 16);
		
		this.direction = "down";
		
		this.renderable.addAnimation("idledown",[0]);
		this.renderable.addAnimation("idleup",[4]);
		this.renderable.addAnimation("idleright",[8]);
		this.renderable.addAnimation("idleleft",[12]);
		
		this.renderable.addAnimation("walkdown",[0,1,2,3]);
		this.renderable.addAnimation("walkup", [4,5,6,7]);
		this.renderable.addAnimation("walkright", [8,9,10,11]);
		this.renderable.addAnimation("walkleft", [12,13,14,15]);
		
		this.renderable.addAnimation("interactdown", [16,17,18,19],2);
		this.renderable.addAnimation("interactup", [20,21,22,23],2);
		this.renderable.addAnimation("interactright", [24,25,26,27],2);
		this.renderable.addAnimation("interactleft", [28,29,30,31],2);
		
		this.renderable.setCurrentAnimation("idledown");
		
		
		this.axe = new Axe(this.pos.x, this.pos.y, {});
		this.axe.visible = false;
		this.axe.collidable = false;
		me.game.add(this.axe, 20);
		
		this.interactionActive = false;
		this.interactionCooldown = 40;
		this.interactionCooldownTimer = this.interactionCooldown;
	
		this.shadow = new Shadow(this.pos.x + 1, this.pos.y + this.height - 8);
		me.game.add(this.shadow, 3);
		
		me.game.sort();
		
		this.type = "PLAYER";
	},
	
	update: function() {		
		
		if (this.interactionActive) {
			if (this.interactionCooldownTimer <= 0) {
				this.interactionActive = false;
				//this.axe.visible = false;
				if (!me.state.current().textBoxActive)
					me.state.current().enableMovement();
				this.interactionCooldownTimer = this.interactionCooldown;
			}
			else {
				this.interactionCooldownTimer -= me.timer.tick;
			}				
		}
		else {
			// COLLISION HANDLING
			var res = this.collideType("INTERACTIONZONE");
			if (res) {
				if (!me.state.current().textBoxActive)
					me.state.current().interactionButton.activate(res.obj);
			}
			else
				me.state.current().interactionButton.deactivate();
		}
		
		//MOVEMENT
		if (me.input.isKeyPressed("left")) {
			this.vel.y = 0;
			this.direction = "left";
			this.vel.x += -1 * this.accel.x * me.timer.tick;
			this.renderable.setCurrentAnimation("walkleft");
		}
		else if (me.input.isKeyPressed("right")) {
			this.vel.y = 0;
			this.direction = "right";
		 	this.vel.x += 1 * this.accel.x * me.timer.tick;
			this.renderable.setCurrentAnimation("walkright");
		}
		else if (me.input.isKeyPressed("up")) {
			this.vel.x = 0;
			this.direction = "up";
			this.vel.y += -1 * this.accel.y * me.timer.tick;
			this.renderable.setCurrentAnimation("walkup");
		}
		else if (me.input.isKeyPressed("down")) {
			this.vel.x = 0;
			this.direction = "down";
			this.vel.y += 1 * this.accel.y * me.timer.tick;
			this.renderable.setCurrentAnimation("walkdown");
		}
		else {
			this.vel.x = 0;
			this.vel.y = 0;
			if (!this.interactionActive)
			{
				if (this.direction == "left")
					this.renderable.setCurrentAnimation("idleleft");
				else if (this.direction == "right")
					this.renderable.setCurrentAnimation("idleright");
				else if (this.direction == "up")
					this.renderable.setCurrentAnimation("idleup");
				else if (this.direction == "down")
					this.renderable.setCurrentAnimation("idledown");
			}
		}
		
		this.updateMovement();
		me.game.collide(this);
		
		if (this.vel.x != 0 || this.vel.y != 0 || this.interactionActive) {
			this.shadow.pos.x = this.pos.x + 1;
			this.shadow.pos.y = this.pos.y + this.height - (this.shadow.height / 2);
			this.parent(this);
			return true;
		}
	},
	
	interaction: function(interactionType) {
		
		if (!this.interactionActive)
		{
			this.interactionType = interactionType;
			
			if (this.interactionType == "hand") {
				if (this.direction == "left") {
					this.renderable.setCurrentAnimation("interactleft", "idleleft");
					this.axe.pos.x = this.pos.x - this.axe.width;
					this.axe.pos.y = this.pos.y;
				}
				else if (this.direction == "right") {
					this.renderable.setCurrentAnimation("interactright", "idleright");
					this.axe.pos.x = this.pos.x + this.width;
					this.axe.pos.y = this.pos.y;
				}
				else if (this.direction == "up") {
					this.renderable.setCurrentAnimation("interactup", "idleup");
					this.axe.pos.x = this.pos.x;
					this.axe.pos.y = this.pos.y - (this.axe.height / 2);
				}
				else if (this.direction == "down") {
					this.renderable.setCurrentAnimation("interactdown", "idledown");
					this.axe.pos.x = this.pos.x;
					this.axe.pos.y = this.pos.y + (this.axe.height / 2);
				}
			}
				
			this.interactionActive = true;
			me.state.current().interactionButton.deactivate();
			me.state.current().disableMovement();
		}
	}

});

var Axe = me.ObjectEntity.extend({

	init: function(x, y, settings) {
	
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		settings.image = "axe";
		
		this.parent(x, y, settings);
		
		this.renderable.addAnimation("swing",[0]);
		this.renderable.setCurrentAnimation("swing");
		this.gravity = 0;
	},
	
	update: function() {
		this.parent();
		return true;
	}

});
