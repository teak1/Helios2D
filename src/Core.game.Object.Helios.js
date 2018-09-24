((window) => {
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
})(window);