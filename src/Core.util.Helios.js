((window) => {
	var util = (Helios.require("module"))();
	util.exports.verifyArgs = function (...args) {
		for (var arg of args) {
			if (arg[0].constructor != arg[1]) {
				throw new TypeError(`expected argument type ${arg[1]} got ${arg[0].constructor}`);
			}
		}
	};
	Helios.exports.util = util.require("all");
})(window)