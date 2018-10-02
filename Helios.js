	var version = 0;

	function createModuleOwner() {
		var modules = {};
		return {
			exports: new Proxy({}, {
				set: function (_, name, value) {
					modules[name] = value;
				}
			}),
			require(module) {
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
	Helios = {
		load: [],
		loaded: false,

	};
	var temp = Helios;
	Helios = createModuleOwner();
	Helios.exports.module = createModuleOwner;
	window.onload = function () {
		temp.load.forEach(a_ => a_());
		Helios.loaded = true;
	};
	console.log(`%cHelios`, "font-size:32px;color:red;background-color:#110000;");
	console.groupCollapsed("info");
	console.log("version: %i", version);
	console.log("author: Ian");
	console.log("thank you for using Helios");
	console.groupEnd();

	Helios.on = function (func) {
		if (Helios.loaded) {
			func();
			return;
		};
		Helios.load.push(func);
	};
	Helios.load = [];
	delete version;
	delete temp;