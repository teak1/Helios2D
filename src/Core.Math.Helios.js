((window) => {
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
})(window)