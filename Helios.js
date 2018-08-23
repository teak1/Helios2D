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
		var scripts = ["Core.Math.Helios.js", "Core.Worker.js", "Core.Render.Interface.Helios.js", "Core.Surface.Helios.js", "Core.ThreadAgent.Helios.js", "Core.game.Object.Helios.js", "Core.game.Helios.js"];
		var a = 0;
		scripts.forEach((_, b) => {
			a++;
			this.setTimeout(j => {
				var scr = document.createElement("script");
				scr.src = "./src/" + _;
				document.head.appendChild(scr);
				console.log("+" + _);
				scr.addEventListener("load", () => {
					// scr.parentElement.removeChild(scr);
					// scr.remove()
					a--;
					console.log("-" + _);
				});
			}, b * 100)
		});
		var b = () => {
			if (a === 0) {
				// console.log(temp);
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
		load: []
	};
	Helios.on = function (func) {
		Helios.load.push(func);
	}
})();