// game resources
var g_resources = [

	{name: "col_tiles",		type: "image", src: "assets/maps/col_tiles.png"},
	
	{name: "tileset",		type: "image", src: "assets/gfx/tileset.png"},
	
	{name: "textboxback",		type: "image", src: "assets/gfx/textboxback.png"},
	{name: "textboxback-other",		type: "image", src: "assets/gfx/textboxback-other.png"},
	{name: "textboxbutton",		type: "image", src: "assets/gfx/textboxbutton.png"},
	
	{name: "interactionbutton",			type: "image", src: "assets/gfx/interactionbutton.png"},
	{name: "titlescreen",		type: "image", src: "assets/gfx/titlescreen.png"},
	{name: "endingscreen",		type: "image", src: "assets/gfx/endingscreen.png"},
	{name: "gameoverscreen",		type: "image", src: "assets/gfx/gameoverscreen.png"},
	{name: "gameoverbutton",		type: "image", src: "assets/gfx/gameoverbutton.png"},
	
	{name: "player",			type: "image", src: "assets/gfx/player.png"},
	{name: "axe",				type: "image", src: "assets/gfx/axe.png"},
	// DESTROYABLES
	{name: "des-stereo",		type: "image", src: "assets/gfx/des-stereo.png"},
	{name: "des-toiletdoor",		type: "image", src: "assets/gfx/des-toiletdoor.png"},
	{name: "des-toilet",		type: "image", src: "assets/gfx/des-toilet.png"},
	
	// PEOPLE
	{name: "ppl-01",			type: "image", src: "assets/gfx/ppl-01.png"},
	{name: "ppl-02",			type: "image", src: "assets/gfx/ppl-02.png"},
	{name: "ppl-03",			type: "image", src: "assets/gfx/ppl-03.png"},
	{name: "ppl-04",			type: "image", src: "assets/gfx/ppl-04.png"},
	{name: "ppl-boss",			type: "image", src: "assets/gfx/ppl-boss.png"},
	
	// EFFECTS
	{name: "effect-shadow",			type: "image", src: "assets/gfx/effect-shadow.png"},
	{name: "effect-explosion",			type: "image", src: "assets/gfx/effect-explosion.png"},

	// MUSIC
	{name: "disturbing",			type: "audio", src: "assets/music/", channel: 1},
	
	// SOUNDS
	{name: "explosionsound",	type: "audio", src: "assets/sounds/", channel: 1},
	{name: "slap",	type: "audio", src: "assets/sounds/", channel: 2},
	{name: "textbox",	type: "audio", src: "assets/sounds/", channel: 3},
	//MAPS
	{name: "testmap",			type: "tmx", src: "assets/maps/testmap.json"},
	{name: "printroom",			type: "tmx", src: "assets/maps/printroom.json"},
	{name: "bossfloor",			type: "tmx", src: "assets/maps/bossfloor.json"},
	{name: "workingfloor",			type: "tmx", src: "assets/maps/workingfloor.json"},
	{name: "toilet01",			type: "tmx", src: "assets/maps/toilet01.json"}
	
];