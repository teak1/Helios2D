((window) => {
	var Game = Helios.require("module")();
	var math = Helios.require("Math");
	var Objects = Helios.require("GObject");

	function createNewAgent(type) {
		return {
			Agent: Helios.require(type),
			store: {}
		};
	}
	class _Game {
		constructor(width, height, element) {
			this.threadAgent = new(createNewAgent("ThreadAgent").Agent)();
			this.renderAgent = createNewAgent("Render");
			this.assets = {};

			this.game = {
				collisions: [],
				surface: this.renderAgent.Agent.createSurface(width || 400, height || 400, element),
				events: {},
				frametime: 0,
				color_helper: Helios.require("Color")
			};
			this.collision_handler = this.threadAgent.addFunctionThread(function (data) {
				if (data === "ping") return "pong";
				var id = data.id;
				var collisions = data.collisions;
				var self = data.self;
				var colliding = [];
				for (var i = 0; i < collisions.length; i++) {
					if (collisions[i].x > self.x + self.w && collisions[i].x + collisions[i].w > self.x && self.y < collisions[i].y + collisions[i].h && self.y + self.h > collisions[i].y) {
						colliding.push([self.id, collisions[i].id]);
					};
				}
				return colliding;
			});
			this.collision_handler.setReturn(_ => _.length >= 1 ? console.warn(_) : "");
			this.user = {
				mouse: new math.Vector2D(),
				keys: {},
				mousePressed: false
			};
			this.game.surface.event("mousemove", _ => {
				var surf = this.game.surface._elt.getClientRects()[0];
				this.user.mouse = new math.Vector2D(_.x, _.y);
				this.user.mouse.sub(surf.left, surf.top);
			});
			this.game.surface.event("keydown", _ => {
				this.user.keys[_.key] = true;
			});
			this.game.surface.event("keyup", _ => {
				this.user.keys[_.key] = false;
			});
			this.game.surface.event("mousedown", _ => {
				this.user.mousePressed = _.which;
			});
			this.game.surface.event("mouseup", _ => {
				this.user.mousePressed = false;
			});
			this.__draw__();
		}
		key(ord) {
			if (this.user.keys) {
				if (this.user.keys[ord]) {
					return true;
				}
			}
			return false;
		}
		on(event, func) {
			this.game.events[event] = this.game.events[event] || [];
			this.game.events[event].push(func);
		}
		pysicsUpdate() {
			var collideable_nonstatic = [];
			var collideable_static = [];
			for (var j = 0; j < this.game.collisions.length; j++) {
				if (this.game.collisions[j].static) {
					this.game.collisions[j].id = j;
					collideable_static.push(this.game.collisions[j]);
				} else {
					collideable_nonstatic.push(this.game.collisions[j]);
					this.game.collisions[j].id = j;
				}
			}
			if (collideable_nonstatic.length != 0) {
				for (var i = 0; i < collideable_nonstatic.length; i++) {
					this.collision_handler.run({
						collisions: collideable_static,
						self: collideable_nonstatic[i],
						id: i
					});
				}
			}
		}
		__draw__() {
			var start = performance.now();
			if (this.game.events.draw) {
				this.game.events.draw.forEach(func => func(this.game.surface, this.game.color_helper));
			}
			this.pysicsUpdate();
			this.game.surface.__render__();
			setTimeout(_ => this.__draw__(), 1000 / 60);
			var end = performance.now();
			var difference = end - start;
			this.game.frametime += difference;
			this.game.frametime /= 2;
		}
		get Object() {
			return Helios.require("WorldObject").Object;
		}
		loadAsset(url, callback) {
			if (url.match(/jpeg|gif|png|apng|svg|bmp|ico/)) {
				var image = new Image();
				image.addEventListener("load", (event) => {
					var img = event.path[0];
					callback ? callback(img) : null;
				});
				image.src = url;
			} else if (url.match(/json/)) {
				fetch(url).then(a => a.json()).then(callback);
			} else {
				fetch(url).then(a => a.text()).then(callback);
			}
		}
		registerAsset(name, asset) {
			this.assets[name] = asset;
		}
	}
	Game.exports.Game = _Game;
	Helios.exports.Game = Game.require("all");
})(window)