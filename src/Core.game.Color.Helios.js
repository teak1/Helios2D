((window) => {
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
	};
	Helios.exports.Color = Color.require("all");
})(window)