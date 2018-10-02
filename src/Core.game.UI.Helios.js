((window) => {
	var UI = Helios.require("module")();
	UI.UI = class _UI {
		constructor(surface) {
			this.element = surface.getUILayer();
		}
	};
	Helios.exports.UI = UI.require("all");
})(window)