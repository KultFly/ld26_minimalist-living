var TitleScreen = me.ScreenObject.extend({

	init: function()
	{

		this.addAsObject = true;
	},
	
	onResetEvent: function(endOrStart)
	{
		this.status = endOrStart;
		if (this.status == "start") {
			this.startButton = new startButton(0, 0, {image: me.loader.getImage("titlescreen"), spritewidth: this.width, spriteheight: this.height});
		}
		else {
			this.startButton = new startButton(0, 0, {image: me.loader.getImage("endingscreen"), spritewidth: this.width, spriteheight: this.height});
			this.startButton.isClickable = false;
		}
		me.game.add(this.startButton, 19);
		me.game.sort();
	},
	
	update: function()
	{
		this.parent();
		
		return true;
	}
});

var startButton = me.GUI_Object.extend({
   
   init: function(x, y, settings)
   {
		this.parent(x, y, settings);
   },
	
   onClick:function()
   {
		me.state.change(me.state.PLAY, "printroom");
		this.isClickable = false;
		return true;
   }
});