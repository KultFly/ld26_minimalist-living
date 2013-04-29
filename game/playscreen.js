var PlayScreen = me.ScreenObject.extend({

	init: function() {
		this.addAsObject = true;
		this.parent(true);
	},
	
	onResetEvent: function(levelname) {
		
		me.audio.unmuteAll();
		me.levelDirector.loadLevel(levelname);
		if (me.game.currentLevel.seq)
			this.seq = me.game.currentLevel.seq;
		this.seqActive = false;
		this.seqTimer = 0;
		this.seqCurrentTimer = 0;
		this.seqPart = 0;
		
		this.font = new me.Font("Arial", 24, "white");
		this.bigfont = new me.Font("Arial", 96, "white");
		
		this.gameoverActive = false;
		this.gameoverText = "that's sad";
		
		this.textBoxActive = false;
		this.enableMovement();
		
		this.interactionButton = new InteractionButton(me.game.viewport.getWidth() - 78, 16, me.loader.getImage("interactionbutton"), 64, 64);
		me.game.add(this.interactionButton, 10);
		
		this.gameoverButton = new gameoverButton(me.game.viewport.getWidth() / 2 - 96, 
																		me.game.viewport.getHeight() / 2 + 64,
																		me.loader.getImage("gameoverbutton"), 192, 96);
		me.game.add(this.gameoverButton, 16);
		
		me.game.sort();
		
		this.scriptedSequence(this.seq);
	},
	
	// ENABLE AND DISABLE MOVEMENT
	enableMovement: function() {
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.DOWN, "down");
	},
	disableMovement: function() {
		me.input.unbindKey(me.input.KEY.LEFT);
		me.input.unbindKey(me.input.KEY.RIGHT);
		me.input.unbindKey(me.input.KEY.UP);
		me.input.unbindKey(me.input.KEY.DOWN);
	},
	
	gameover: function(gameoverText) {
	
		me.audio.muteAll();
		
		this.gameoverActive = true;
		this.gameoverText = gameoverText;
		
		me.game.add(new me.SpriteObject(0,0,me.loader.getImage("gameoverscreen"), 800, 480), 15);
		me.game.sort();
		
		activeTextBoxes = me.game.getEntityByName("textboxdialogue");
		for (i in activeTextBoxes)
			me.game.remove(activeTextBoxes[i], true);
		
		this.disableMovement();
		me.game.remove(this.interactionButton);
		
		this.gameoverButton.visible = true;
		this.gameoverButton.isClickable = true;
	},
	
	update: function() {	
	
			if (this.seqActive)
			{
				if (this.seqCurrentTimer <= 0) {
					this.seqActive = false;
					this.seqPart++;
					this.scriptedSequence(this.seq);
				}
				else
					this.seqCurrentTimer -= me.timer.tick;
			}
			
		this.parent()
		return true;
	},
	
	draw: function(context) {
		if (this.gameoverActive) {
			var gameoverWidth = this.bigfont.measureText(context, "GAME OVER").width;
			this.bigfont.draw(context, "GAME OVER", (me.game.viewport.getWidth() /2) - (gameoverWidth / 2), 96);
			this.font.draw(context, this.gameoverText, 
								(me.game.viewport.getWidth() /2) - (gameoverWidth / 2), 
								me.game.viewport.getHeight() / 2 - 32);
			this.font.draw(context, "TRY AGAIN", this.gameoverButton.pos.x + 32, this.gameoverButton.pos.y + 24);
		}
			
		this.parent(context);
	},
	
	scriptedSequence: function(sequence) {
		switch (sequence) {
			case "s01":
			
				switch (this.seqPart)
				{
					case 0:
						this.disableMovement();
						this.seqActive = true;
						this.seqCurrentTimer = 200;
					break;
					case 1: 
						me.game.viewport.fadeOut("#730000", 200);
						this.seqActive = true;
						this.seqCurrentTimer = 30;
						me.audio.play("explosionsound");
					break;
					case 2: 
						me.game.viewport.fadeOut("#730000", 200);
						this.seqActive = true;
						this.seqCurrentTimer = 40;
						me.audio.play("explosionsound");
					break;
					case 3: 
						me.game.add(new TextBoxDialogue(["Argh...", "I can't stand this anymore!", "I have to get out of here..."], "player"), 20);
						me.game.sort();
						this.seqPart = 0;
					break;
				}
			
			break;
		}
	},
	
	onDestroyEvent: function() {
		this.seq = "";
	}

});


var gameoverButton = AnimatedButton.extend({

	init: function(x, y, image, spritewidth, spriteheight) {
		this.parent(x, y, image, spritewidth, spriteheight);
		
		this.addAnimation("idle", [0]);
		this.setCurrentAnimation("idle");
		this.isClickable = false;
		this.visible = false;
	},
	
	onClick: function() {
		me.state.change(me.state.PLAY, me.levelDirector.getCurrentLevelId());
		return true;
	}
});

// MAIN INTERATION BUTTON
var InteractionButton = AnimatedButton.extend({

	init: function(x, y, image, spritewidth, spriteheight) {
		this.parent(x, y, image, spritewidth, spriteheight);
		
		this.animationspeed = me.sys.fps / 60;
		this.addAnimation("look", [0]);
		this.addAnimation("speak", [1]);
		this.addAnimation("hand", [2]);
		this.addAnimation("clicked",[3,4,5,6]);
		this.addAnimation("disabled",[7]);
		this.setCurrentAnimation("disabled");
		
		this.isClickable = false;
		this.intObj;
	},
	
	activate: function(intObj) {
		this.intObj = intObj;
		if (this.intObj.intType == "lookable")
			this.setCurrentAnimation("look");
		else if (this.intObj.intType == "speak")
			this.setCurrentAnimation("speak");
		else
			this.setCurrentAnimation("hand");
		this.isClickable = true;
	},
	
	deactivate: function() {
		this.isClickable = false;
		if (this.isCurrentAnimation("clicked"))
			this.isCurrentAnimation("clicked", "disabled");
		else
			this.setCurrentAnimation("disabled");
		this.intObj = "";
	},
	
	onClick: function() {
		this.setCurrentAnimation("clicked", "disabled");
		this.intObj.son.interact();
		me.game.getEntityByName("PLAYER")[0].interaction(this.intObj.intType);
		
		return true;
	}

});