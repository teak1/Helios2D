(() => {
	var version = 0;
	window.addEventListener("load", () => {
		function createModuleOwner() {
			var modules = {};
			return {
				exports: new Proxy({}, {
					set: function (_, name, value) {
						modules[name] = value;
						//console.log("registering " + name);
					}
				}),
				require(module) {
					//console.log("requesting " + module);
					if (module === "all") return modules;
					if (modules[module]) {
						if (modules[module][module]) return modules[module][module];
						return modules[module]
					} else {
						console.error("module " + module + " not found");
						return {};
					}
				}
			}
		}
		var temp = Helios;
		Helios = createModuleOwner();
		Helios.exports.module = createModuleOwner;
		var b = () => {
			if (a === 0) {
				// console.log(temp);
				debugger;
				temp.load.forEach(a_ => a_());
				console.log(`%cHelios`, "font-size:32px;color:red;background-color:#110000;");
				console.groupCollapsed("info");
				console.log("version: %i", version);
				console.log("author: Ian Senne");
				console.log("thank you for using Helios");
				console.groupEnd();
			} else setTimeout(b);
		}
		b();
	});
	Helios = {
		load: [() => {
			window.all = Helios.require("all");
		}]
	};
	Helios.on = function (func) {
		Helios.load.push(func);
	}
})();((window) => {
	var util = Helios.require("module")();
	util.exports.verifyArgs = function (...args) {
		for (var arg of args) {
			if (arg[0].constructor != arg[1]) {
				throw new TypeError(`expected argument type ${arg[1]} got ${arg[0].constructor}`);
			}
		}
	}
	Helios.exports.util = util.require("all");
})(window)((window) => {
	var math = Helios.require("module")();
	class Vector2D {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			if (x && x.constructor === Vector2D) {
				this.x = x.x;
				this.y = x.y;
			} else if (!x) {
				this.x = 0;
				this.y = 0;
			}
		}
		add(x, y) {
			var v2 = new Vector2D(x, y);
			this.x += v2.x;
			this.y += v2.y;
			return this;
		}
		sub(x, y) {
			var v2 = new Vector2D(x, y);
			this.x -= v2.x;
			this.y -= v2.y;
		}
		mult(x, y) {
			var v2 = new Vector2D(x, y);
			this.x *= v2.x;
			this.y *= v2.y;
		}
		div(x, y) {
			var v2 = new Vector2D(x, y);
			this.x /= v2.x;
			this.y /= v2.y;
		}
		toString() {
			return `(${this.x},${this.y})`;
		}
	}
	class Volume2D {
		constructor(x, y, w, h) {
			this.pos = new Vector2D(x, y);
			this.size = new Vector2D(w || y, h);
		}
	}
	math.exports.Volume2D = Volume2D;
	math.exports.Vector2D = Vector2D;
	Helios.exports.Math = math.require("all");
})(window)((window) => {
	var Workers = Helios.require("module")();
	var WorkerSupported = Worker ? true : false;
	var Threads = [];

	function makeNewWorker(func) {
		var blob = new Blob([
			"global={onmessage:function(){},postmessage:(msg)=>{postMessage(msg)}};func=" + func.toString() + ";onmessage=function(message){postMessage(func(message.data))}"
		]);

		// Obtain a blob URL reference to our worker 'file'.
		var blobURL = window.URL.createObjectURL(blob);

		var worker = new Worker(blobURL);
		worker.postMessage("ping"); // Start the worker.
		return worker
	}
	class Thread {
		constructor(func) {
			if (WorkerSupported) {
				this.worker = makeNewWorker(func);
				this.worker.onmessage = message => {
					// console.log(message);
					this.avalable = true;
					this.callback(message.data);
				}
				Threads.push(this.worker);
			} else {
				this.worker = new Function(func.toString());
			}
			this.func = func;
			this.avalable = true;
			this.callback = new Function();
		}
		post(message) {
			this.avalable = false;
			this.worker.postMessage(message);
		}
		on(func) {
			this.callback = func
		}
	}

	function dispose() {
		Threads.forEach(_ => {
			_.terminate();
		});
		Threads = [];
	}
	Workers.exports.dispose = dispose;
	Workers.exports.Thread = Thread;
	Helios.exports.Thread = Workers.require("all");
})(window)((window) => {
	// p5Interface = Helios.require("module")();
	var Render = Helios.require("module")();
	var _Render = {
		surfaces: []
	};
	Render.exports.internal = {
		__createRenderSurface__(width, height, target) {
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", width);
			canvas.setAttribute("height", height);
			var surface = Helios.require("Surface");
			var render_surface = new surface(canvas, width, height);
			_Render.surfaces.push(render_surface);
			if (target) target.appendChild(canvas);
			else document.body.appendChild(canvas);
			return render_surface;
		},
		__getRenderSurfaces() {
			return _Render.surfaces;
		}
	}
	Render.exports.createSurface = function (width, height) {
		var render = Helios.require("Render");
		return render.internal.__createRenderSurface__(width, height);
	}
	Helios.exports.Render = Render.require("all");
})(window)((window) => {
	var Surface = Helios.require("module")();
	var math = Helios.require("Math");
	class _Surface {
		constructor(element, width, height) {
			this.visible = true;
			this._elt = element;
			this.width = 0;
			this.height = 0;
			this.context = this._elt.getContext("2d");
			this.renderCommands = [];
			this.colors = {};
			this.__init__(width, height);
			this.listener = document.createElement("textarea");
			this.listener.style.width = this.width + "px";
			this.listener.style.height = this.height + "px";
			this.listener.style.position = "absolute";
			this.listener.style.top = "0px";
			this.listener.style.left = "0px";
			this.listener.style.background = "transparent";
			this.listener.style.borderWidth = "0px";
			this.listener.style.borderStyle = "none";
			this.listener.style.borderColor = "transparent";
			this.listener.style.overflow = "auto";
			this.listener.style.resize = "none";
			this.listener.style.outline = "0";
			this.listener.style.cursor = "default"
			this.listener.style.color = "transparent";
			this.listener.style.padding = "0px";
			this.listener.addEventListener("mousedown", _ => this.__event_handler__(_));
			this.listener.addEventListener("mouseup", _ => this.__event_handler__(_));
			this.listener.addEventListener("mousewheel", _ => this.__event_handler__(_));
			this.listener.addEventListener("mousemove", _ => this.__event_handler__(_));
			this.listener.addEventListener("keydown", _ => this.__event_handler__(_));
			this.listener.addEventListener("keyup", _ => this.__event_handler__(_));
			this.listener.addEventListener("blur", _ => this.listener.focus());
			this.listener.addEventListener("contextmenu", e => e.preventDefault());
			this.events = {};
			this.UIContainer = document.createElement("div");
			this.UIContainer.style.width = this.width + "px";
			this.UIContainer.style.height = this.height + "px";
			this.UIContainer.style.position = "absolute";
			setTimeout(() => {
				this._elt.parentElement.appendChild(this.UIContainer);
				this._elt.parentElement.appendChild(this.listener);
				this.listener.focus();
				setInterval(_ => this.__align__(), 100);
				// console.log(rect);
			});
		}
		__align__() {
			var rect = this._elt.getClientRects()[0];
			this.listener.style.top = rect.y + "px";
			this.listener.style.left = rect.x + "px";
			this.listener.style.width = rect.width + "px";
			this.listener.style.height = rect.hieght + "px";
			this.UIContainer.style.top = rect.top + "px";
			this.UIContainer.style.left = rect.left + "px";
			this.UIContainer.style.width = rect.width + "px";
			this.UIContainer.style.height = rect.hieght + "px";
		}
		event(type, func) {
			this.events[type] = this.events[type] || [];
			this.events[type].push(func);
		}
		__event_handler__(event) {
			// event.type.match(/mouse/) ? "" : console.log(event);
			// console.log(event.type);
			if (this.events[event.type]) this.events[event.type].forEach(fn => fn(event));
			event.preventDefault();
		}
		__init__(width, height) {
			this.width = width || this.width;
			this.height = height || this.height;
		}
		__render__() {
			// console.log(this.renderCommands);
			for (var i = 0; i < this.renderCommands.length; i++) {
				if (this._elt) this.renderCommands[i].handle(this.context);
			}
			this.renderCommands = [];
		}
		fill(color) {
			this.colors.fill = color; //parseInt(color.toString().replace(/#/g, ""), 16);
		}
		stroke(color) {
			this.colors.stroke = color; //parseInt(color.toString().replace(/#/g, ""), 16);
		}
		background() {
			this.rect(-1, -1, this.width + 2, this.height + 2);
		}
		rect(x, y, w, h) {
			this.renderCommands.push(new renderCommand({
				type: "rect",
				pos: new math.Vector2D(x, y),
				size: new math.Vector2D(w, h),
				fill: this.colors.fill || 0,
				stroke: this.colors.stroke || 0
			}));
		}
		image(image, x, y, w, h) {
			if (image === undefined) return
			this.renderCommands.push(new renderCommand({
				type: "image",
				pos: new math.Vector2D(x, y),
				size: new math.Vector2D(w, h),
				image: image
			}));
		}
		getUILayer() {
			return this.UIContainer;
		}
	}
	class renderCommand {
		constructor(opts) {
			this.type = opts.type || "none";
			this.pos = opts.pos || new math.Vector2D();
			this.size = opts.size || new math.Vector2D();
			this.colorFill = opts.fill;
			this.colorStroke = opts.stroke;
			this.image = opts.image;
		}
		handle(can) {
			var ctx = can //.getContext("2d");
			if (this.type === "rect") {
				if (this.colorFill != 0) ctx.fillStyle = this.colorFill;
				if (this.colorStroke != 0) ctx.strokeStyle = this.strokeStyle;
				ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
				// ctx.fill();
				ctx.stroke();
			} else if (this.type === "image") {
				ctx.drawImage(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y);
			}
		}
	}
	Surface.exports._RC = renderCommand;
	Surface.exports.Surface = _Surface;
	// console.log(Surface);
	Helios.exports.Surface = Surface.require("all");
})(window)((window) => {
	var ThreadAgent = Helios.require("module")();
	var Thread = Helios.require("Thread");
	class _ThreadAgent {
		constructor() {
			this.threads = {};
			this.count = 0;
			this.maxThreads = 100;
			this.functions = [];
		}
		addFunctionThread(func) {
			if (this.functions.includes(func)) return;
			if (this.count >= this.maxThreads) throw new Error("threads maxed out, are you adding threads in a loop?");
			this.functions.push(func);
			var id = func.toString();
			this.threads[id] = this.threads[id] || new _TAFunc(func, this);
			var thread = new Thread(func);
			this.threads[id].register(thread);
			return this.threads[id];
		}
	}
	class _TAFunc {
		constructor(func, Agent) {
			this.Agent = Agent;
			this.return = new Function();
			this.function = func;
			this.threads = [];
			this.next = 0;
			this.localLimit = 5;
		}
		register(thread) {
			thread.on((a) => {
				// console.log(a);
				this.return(a);
			});
			if (this.Agent.count > this.Agent.maxThreads) return;
			this.threads.push(thread);
		}
		run(args) {
			for (var i = 0; i < this.threads.length; i++) {
				if (this.threads[i].avalable) {
					this.threads[i].post(args || "");
					return;
				}
			}

			if (this.Agent.count > this.Agent.maxThreads || this.threads.length < this.localLimit) {
				this.next++;
				this.next = this.next % this.threads.length;
				this.threads[this.next].post(args || "");
				return;
			}
			this.Agent.count++;
			this.threads.push(new Thread(this.function));
			this.run(args || "");
		}
		setReturn(func) {
			this.return = func;
		}
	}
	ThreadAgent.exports.ThreadAgent = _ThreadAgent;
	Helios.exports.ThreadAgent = ThreadAgent.require("ThreadAgent");
})(window)((window) => {
	var GObject = Helios.require("module")();
	var math = Helios.require("Math");
	class _GObject {
		constructor(opts) {
			var things = Object.keys(opts);
			for (var i = 0; i < things.length; i++) {
				this[things[i]] = opts[things[i]];
			}
		}
	}
	class _GVolume extends _GObject {
		constructor(x, y, w, h) {
			super({
				colidable: true
			});
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
		}
	}
	class _GOCollidable extends _GVolume {
		constructor(x, y, w, h, isStatic) {
			super(x, y, w, h)
			this.static = isStatic;
		}
	}
	GObject.exports.GOCollidable = _GOCollidable;
	Helios.exports.GObject = GObject.require("all");
})(window);((window) => {
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
				// console.log(data);
				// return data;
				var id = data.id;
				var collisions = data.collisions;
				var self = data.self;
				var colliding = [];
				// if (!collisions || !check_against) return -1;
				// console.log(data);
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
})(window)((window) => {
	var UI = Helios.require("module")();
	UI.UI = class _UI {
		constructor(surface) {
			this.element = surface.getUILayer();
		}
	}
	Helios.exports.UI = UI.require("all");
})(window)((window) => {
	var util = Helios.require("util");
	var Color = Helios.require("module")();
	class _rgb {
		constructor(r, g, b) {
			this.r = r;
			this.g = g;
			this.b = b;
		}
		toString() {
			return `rgb(${this.r},${this.b},${this.g})`;
		}
	}
	Color.exports.rgb = function (r, g, b) {
		util.verifyArgs([r, Number], [g, Number], [b, Number]);
		return new _rgb(r, g, b);
	}
	Helios.exports.Color = Color.require("all");
})(window)