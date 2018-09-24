((window) => {
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
})(window)