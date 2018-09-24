function game() {
	var Game = new(Helios.require("Game"))(innerWidth / 2, innerHeight / 2);
	Game.loadAsset("./assets/test.jpeg", (img) => {
		Game.registerAsset("test", img);
	});
	window.Game = Game;
	Game.on("draw", function (ren) {
		ren.fill("#000000");
		ren.background();
		ren.fill("#AAAAFF");
		ren.rect(Game.user.mouse.x, Game.user.mouse.y, 50, 50);
		// console.log(Game.user.keys);
		ren.image(Game.assets.test, Game.user.mouse.x, Game.user.mouse.y, 50, 50);
		if (debug) {
			debug.innerHTML = JSON.stringify(Game);
		}
	});
}
Helios.on(game);