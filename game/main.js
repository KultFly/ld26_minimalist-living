window.onReady(function() 
{
	jsApp.onload();
});

var jsApp =
{
	onload: function()
	{
		if (!me.video.init('jsapp',  800, 480, true, 1.0, 1.0 ))
		{
			alert("No HTML5 Canvas support :-[ ");
			return;
		}		
		//me.sys.fps = 30;
		
		me.sys.useNativeAnimFrame = true;
		
		// Initalize the audio
		me.audio.init("mp3, ogg");
		
		// Setup everything from the loaded function
		me.loader.onload = this.loaded.bind(this);
		
		// Preload all the resources from the additional 'g_resources'
		me.loader.preload(g_resources);
		
		// Display the loading screen while and start loading
		me.state.change(me.state.LOADING);
	},
	
	loaded: function()
	{
		// Draws boxes for debugging purposes
		//me.debug.renderHitBox = true;
		
		// Set a new Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
		me.state.set(me.state.USER + 0, new TitleScreen());
		
		me.state.transition("fade", "#000000", 400);
		
		// Add the entities
		me.entityPool.add("player", PlayerEntity);
		me.entityPool.add("people", PeopleEntity);
		me.entityPool.add("destroyable", DestroyableEntity);
		me.entityPool.add("lookable", LookableEntity);
		me.entityPool.add("textboxtrigger", TextboxTrigger);
		me.entityPool.add("interaction", InteractingZone);

		// Change the state
		me.state.change(me.state.USER + 0, "start");
	}
};