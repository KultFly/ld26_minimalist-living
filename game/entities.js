var InteractingZone = me.ObjectEntity.extend({

	init: function(x, y, settings) {
		this.intType = settings.intType;
		this.parent(x, y, settings);
		
		this.collidable = true;
		this.type = "INTERACTIONZONE";
		
		this.son;
		this.foundSon = false;
	},
	
	update: function() {
		
		if (!this.foundSon)
		{	
			res = this.collide();
			if (res) {
				if (res.type == "DESTROYABLE" || res.type == "PEOPLE" || res.type == "LOOKABLE") {
					this.son = res.obj;
					this.son.father = this;
					this.foundSon = true;				
				}
			}
		}
		
		this.parent();
		return true;
	}

});

//////////////////////
// INTERACTING ENTITY 
//////////////////////
var InteractingEntity = me.ObjectEntity.extend({
	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
		
		this.collidable = true;
		this.hurt = false;
		this.hurtCooldown = 30;
		this.hurtCooldownTimer = this.hurtCooldown;
		this.father;
	},
		
	update: function () {	
		this.parent(this);
		
		if (this.hurtCooldownTimer <= 0) {
			this.hurt = false;
			this.hurtCooldownTimer = this.hurtCooldown;
		}
		else
			this.hurtCooldownTimer -= me.timer.tick;

		return true;
	}
	
});

//////////////////////
// LOOKABLE ENTITY
//////////////////////
var LookableEntity = InteractingEntity.extend({
	
	init: function(x, y, settings) {
				
		if (settings.energy)
			this.energy = settings.energy;
			
		this.id = settings.id;
			
		this.parent(x, y, settings);

		this.type = "LOOKABLE";
		
		this.hurtCooldown = 30;
		this.hurtCooldownTimer = this.hurtCooldown;
	},
		
	interact: function() {
		if (this.hurt) {
			// NOTHIN
		}
		else {
			this.hurt = true;

			switch (this.id)
			{
				case "l01":
					me.game.add(new TextBoxDialogue(["What's wrong with you?!"],"player"), 15);
					me.game.sort();
				break;
				
				case "l02":
					me.game.add(new TextBoxDialogue(["What an idyllic scene.", "I've never understood why this is placed here."],"player"), 15);
					me.game.sort();
				break;
				
				case "l03":
					if (this.energy >= 2) {
						me.game.add(new TextBoxDialogue(["I don't think I can fit trough there."],"player"), 15);
						me.game.sort();
					}
					if (this.energy == 1) {
						me.game.add(new TextBoxDialogue(["I really don't want to try!"],"player"), 15);
						me.game.sort();
						this.father.intType = "hand";
					}
					if (this.energy == 0) {
						me.state.current().gameover("Mashed in a bathroom window. How cruel.");
					}
				break;
				
				case "l04":
					me.game.add(new TextBoxDialogue(["The door of this stall is stucked."],"player"), 15);
					me.game.sort();
				break;
				
				case "l05":
					me.game.add(new TextBoxDialogue(["Mirrors."],"player"), 15);
					me.game.sort();
					me.game.remove(this.father);
					me.game.remove(this);
				break;
				
				case "l06":
					me.game.add(new TextBoxDialogue(["I don't want this anymore."],"player"), 15);
					me.game.sort();
				break;
				
				case "l07":
					me.game.add(new TextBoxDialogue(["A designer sideboard for several thousand bucks.", "I want to leave all this..."],"player"), 15);
					me.game.sort();
				break;
				
				case "l08":
					me.game.add(new TextBoxDialogue(["I'll not go back. I wan't to live a minimum life."],"player"), 15);
					me.game.sort();
				break;
				
				case "l09":
					me.game.add(new TextBoxDialogue(["Concrete. A big advert 'The new Carcar'."],"player"), 15);
					me.game.sort();
				break;
				
				case "l10":
					me.game.add(new TextBoxDialogue(["A big tasty potato."],"player"), 15);
					me.game.sort();
				break;
				
				case "l100":
					if (Math.floor(Math.random()*2) == 0)
						me.game.add(new TextBoxDialogue(["I thought we were friends!!!"],"player"), 15);
					else
						me.game.add(new TextBoxDialogue(["Ouch!"],"player"), 15);
					me.game.sort();
				break;
			}
			
			if (this.energy != 0){
					this.energy--;
			}
			
		}
	}
});

//////////////////////
// PEOPLE ENTITY
//////////////////////
var PeopleEntity = InteractingEntity.extend({
	
	init: function(x, y, settings) {
		
		settings.spritewidth = 32;
		settings.spriteheight = 64;
		
		this.id = settings.image;
		
		if (settings.energy)
			this.energy = settings.energy;
			
		this.parent(x, y, settings);
		
		this.renderable.addAnimation("idle",[0]);
		this.renderable.addAnimation("slappedleft",[1], 1);
		this.renderable.addAnimation("slappedright",[2], 1);
		this.renderable.setCurrentAnimation("idle");

		this.type = "PEOPLE";
		
		this.hurtCooldown = 30;
		this.hurtCooldownTimer = this.hurtCooldown;
	},
	
	update: function() {
		this.parent();
		if (!this.hurt)
			this.renderable.setCurrentAnimation("idle");
		return true;
	},
	
	slap: function() {
		if (Math.floor(Math.random()*2) == 0)
			this.renderable.setCurrentAnimation("slappedright");
		else
			this.renderable.setCurrentAnimation("slappedleft");
		me.audio.play("slap", false);
	},
	
	interact: function() {
		if (this.hurt) {
			console.log("people is still slapped!");
		}
		else {
			this.hurt = true;
			switch (this.id)
			{
				case "ppl-01":
					this.slap();
					me.game.add(new TextBoxDialogue(["What's wrong with you?!"], 10));
					me.game.sort();
				break;
				
				case "ppl-02":
					if (this.energy >= 5) {
						me.game.add(new TextBoxDialogue(["Do you like my new suit?"]), 16);
						me.game.sort();
					}
					if (this.energy == 4) {
						me.game.add(new TextBoxDialogue(["I want to quit. I want minimalist living..."], "player"), 16);
						me.game.sort();
					}
					if (this.energy == 3) {
						me.game.add(new TextBoxDialogue(["Maybe you should check your head for minimalist living."]), 16);
						me.game.sort();
					}
					if (this.energy <= 2) {
						this.slap();
					}
				break;
				
				case "ppl-03":
					this.slap();
					if (Math.floor(Math.random()*2) == 0)
						me.game.add(new TextBoxDialogue(["I thought we were friends!!!"]), 16);
					else
						me.game.add(new TextBoxDialogue(["Ouch!"]), 16);
					me.game.sort();
					
				break;
				
				case "ppl-04":
					if (this.energy >= 2) {
						me.game.add(new TextBoxDialogue(["Won't you listen?!"]), 15);
						me.game.sort()
						this.father.intType = "hand";
					}
					else
						me.state.current().gameover("Who would slap someone who knows Karate?!");
				break;
				
				default:
					this.slap();
				break;
			}
				
			this.energy--;
			if (this.energy <= 0) {
				if (this.father)
					me.game.remove(this.father);
			}
		}
	}
	
});

//////////////////////
// DESTROYABLE ENTITY
//////////////////////
var DestroyableEntity = InteractingEntity.extend({

	init: function(x, y, settings) {
	
		if (!settings.energy)
			this.energy = 1;
		else
			this.energy = settings.energy;
		this.parent(x, y, settings);
		
		this.id = settings.image;
		
		if (this.id == "des-stereo") {
			this.renderable.addAnimation("idle",[0,1], 20);
			this.renderable.addAnimation("destroy1",[2]);
			this.renderable.addAnimation("destroy2",[3]);
			this.renderable.addAnimation("hit",[4],30);
			this.renderable.setCurrentAnimation("idle");
			me.audio.playTrack("disturbing", 0.5);
		}
		else {
			this.renderable.addAnimation("idle",[0]);
			this.renderable.setCurrentAnimation("idle");
		}

		this.type = "DESTROYABLE";

		this.hurtCooldown = 30;
		this.hurtCooldownTimer = this.hurtCooldown;
	},
	
	interact: function() {
		if (this.hurt) {
			console.log("destroyable object cools down");
		}
		else {
			this.hurt = true;
			this.energy--;
			
			switch (this.id) {
			
				case "des-stereo":
					if (this.energy > 1) {
						this.renderable.setCurrentAnimation("destroy1");
						me.game.add(new Explosion(this.pos.x, this.pos.y), 7);
						me.game.sort();
					}
					else {
						this.renderable.setCurrentAnimation("destroy2");
						me.game.add(new Explosion(this.pos.x, this.pos.y), 7);
						me.game.sort();
						me.audio.stopTrack("disturbing");
					}
				break;
				
				case "des-toiletdoor":
					me.game.remove(this.father);
					me.game.remove(this);
				break;
				
				case "des-toilet":
					if (this.energy >= 6) {
						me.game.add(new TextBoxDialogue(["UAAAHH! GROSS!!!"], "player"), 15);
						me.game.sort();
					}
					else if (this.energy == 5) {
						me.game.add(new TextBoxDialogue(["GROSS!!!"], "player"), 15);
						me.game.sort();
					}
					else if (this.energy == 4) {
						me.game.add(new TextBoxDialogue(["I don't even know what this is!"], "player"), 15);
						me.game.sort();
					}
					else if (this.energy == 3) {
						me.game.add(new TextBoxDialogue(["Maybe someone should flush this down..."], "player"), 15);
						me.game.sort();
					}
					else if (this.energy == 2) {
						me.game.add(new TextBoxDialogue(["Maybe I should flush this down..."], "player"), 15);
						me.game.sort();
						this.father.intType = "hand";
					}
					else if (this.energy == 1) {
						me.game.add(new TextBoxDialogue(["Whoa!", "I certainly don't want to stay any longer"], "player"), 15);
						me.game.sort();
					}
					else if (this.energy <= 0) {
						me.state.change(me.state.USER + 0, "end");
						me.game.remove(this.father);
						me.game.remove(this);
					}
				break;
			
				default:
					// nothin
				break;
			}
			
			if (this.energy <= 0) {
				me.game.collisionMap.clearTile(this.pos.x / me.game.currentLevel.tilewidth,
															this.pos.y / me.game.currentLevel.tileheight);
				if (this.father)
					me.game.remove(this.father);
				
				me.game.add(new Explosion(this.pos.x, this.pos.y), 7);
				me.game.sort();
				
				me.game.remove(this);
			}
		}
	}
	
});

//////////////////////
// TEXTBOX TRIGGER
//////////////////////
var TextboxTrigger = me.ObjectEntity.extend({

	init: function(x, y, settings) {
	
		this.id = settings.id;
		this.parent(x, y, settings);
		this.collidable = true;
		this.textboxAdded = false;
	},
	
	update: function() {
		this.parent();
		
		res = this.collideType("PLAYER", false);
		if (res) {
			if (!this.textboxAdded) {
				switch (this.id) {
					case 1:
						me.game.add(new TextBoxDialogue(["hehehe", "hehe"], 10));
						me.state.current().gameover("you're dead :-(");
					break;
					case 2:
						me.game.add(new TextBoxDialogue(["Aaaah, wonderful silence..."], "player"),15);
					break;
					case 3:
						me.game.add(new TextBoxDialogue(["Can't let the boss see me. I better keep looking for another \n way out."], "player"), 25);
					break;
					case 4:
						me.state.current().gameover("Caught by the boss. He's talking reason...");
					break;
					case 5:
						me.game.add(new TextBoxDialogue(["Ughh...the music hurts my head..."], "player"),15);
					break;
					case 6:
						me.game.add(new TextBoxDialogue(["Hey! Don't disturb me - I wan't to finish before my Karate training!"]),15);
					break;
					
					//Ugly last minute level changing
					case 70:
						me.state.change(me.state.PLAY, "bossfloor");
					break;
					case 71:
						me.state.change(me.state.PLAY, "workingfloor");
					break;
					case 72:
						me.audio.stopTrack();
						me.state.change(me.state.PLAY, "toilet01");
					break;
					case 73:
						me.audio.stopTrack();
						me.state.change(me.state.USER + 0, "end");
					break;
					
					default:
						me.game.add(new TextBoxDialogue(["hehehe", "hehe"], 10));
					break;
				}
				me.game.sort();
				this.textboxAdded = true;
			}
			me.game.remove(this);
		}
		
		return true;
	}
});