((window) => {
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
	};
	Render.exports.createSurface = function (width, height) {
		var render = Helios.require("Render");
		return render.internal.__createRenderSurface__(width, height);
	};
	Helios.exports.Render = Render.require("all");
})(window)