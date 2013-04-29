var TextBox = me.SpriteObject.extend({

	init: function(settings) {
	
		if (settings.dialogueKind == "player")
			image = me.loader.getImage("textboxback");
		else
			image = me.loader.getImage("textboxback-other");

		y = me.game.viewport.getHeight() - 128;
		
		this.parent(0, y, image, 800, 128);
		
		this.text = settings.text;
		this.font = new me.Font("Arial", 24, "white");
		
		this.floating = true;
		this.type = "TEXTBOX";
		
		this.button = new TextBoxButton(this);
		me.game.add(this.button, 7);
		
		this.active = true;
	},
	
	update: function() {
		this.parent();

		return true;
	},
	
	draw: function(context) {
		this.parent(context);
		this.font.draw(context, this.text, this.pos.x + 24, this.pos.y + 16);
	},
	
	onDestroyEvent : function() {
		this.active = false;
	}

});

var TextBoxButton = me.AnimationSheet.extend({
	
	isClickable: true,
	wasClicked: false,

	init: function(textBox) {
	
		this.textBox = textBox;
		
		x = me.game.viewport.getWidth() - 64;	
		y = me.game.viewport.getHeight() - 64;
		image = me.loader.getImage("textboxbutton");
		this.parent(x, y, image, 48, 48);
		
		this.addAnimation("idle", [0]);
		this.addAnimation("clicked", [1,1]);
		this.setCurrentAnimation("idle");
		
		me.input.registerMouseEvent('mousedown', this, this.clicked.bind(this), true);	
	},
	
	update: function() {
		this.parent();
		return true;
	},
	
	clicked: function() {
		if (this.isClickable) {
			return this.onClick();
		}
	},
		
	onClick: function() {
		this.setCurrentAnimation("clicked", function(){me.game.remove(this)});
		this.isClickable = false;
		me.game.remove(this.textBox);
		return true;
	},
	
	onDestroyEvent : function() {
		me.input.releaseMouseEvent('mousedown', this);
	}

});

var TextBoxDialogue = me.ObjectEntity.extend({

	init: function(dialogueArray, kind) {
	
		settings = [];
		settings.name = "textboxdialogue";
		this.parent(0,0,settings);
		
		this.alwaysUpdate = true;
		
		this.kind = kind;
		this.textBoxes = {};
		this.activeTextBox = 0;
		
		for (var i = 0; i < dialogueArray.length; i++) {
			this.textBoxes[i] = new TextBox({text: dialogueArray[i], dialogueKind: this.kind });
			this.textBoxes[i].button.isClickable = false;
			this.textBoxes[i].visible = false;
			me.game.add(this.textBoxes[i], 6);
		}
		
		this.textBoxesCount = dialogueArray.length - 1;
		
		this.textBoxes[this.activeTextBox].button.isClickable = true;
		this.textBoxes[this.activeTextBox].visible = true;
		me.audio.play("textbox");
		
		if (me.state.isCurrent(me.state.PLAY)) {
			me.state.current().disableMovement();
			me.state.current().textBoxActive = true;
		}
	},
	
	update: function() {
		this.parent();
		
		if (!this.textBoxes[this.activeTextBox].active)
		{
			if(this.activeTextBox == this.textBoxesCount) {
				if (me.state.isCurrent(me.state.PLAY))
					me.state.current().enableMovement();
				me.game.remove(this.textBoxes[this.activeTextBox].button);
				me.game.remove(this);
			}
			else {
				this.activeTextBox++;
				me.audio.play("textbox");
				this.textBoxes[this.activeTextBox].button.isClickable = true;
				this.textBoxes[this.activeTextBox].visible = true;
			}
		}
		return true;
	},
	
	onDestroyEvent : function() {
		for (i in this.textBoxes)
		{
			me.game.remove(this.textBoxes[i]);
			me.game.remove(this.textBoxes[i].button);
		}
		me.state.current().textBoxActive = false;
	}

});

var AnimatedButton = me.AnimationSheet.extend({	
	isClickable : true,
		
	init: function(x, y, image, spritewidth, spriteheight) {
		this.parent(x, y, image, spritewidth, spriteheight);			
		me.input.registerMouseEvent('mousedown', this, this.clicked.bind(this), true);			
	},
	
	update : function() {
		this.parent();
		return true;
	},
	
	clicked : function() {
		if (this.isClickable) {
			return this.onClick();
		}
	},
	
	onClick: function() {
		return true;
	},
	
	onDestroyEvent : function() {
		me.input.releaseMouseEvent('mousedown', this);
	}
});