const fs = require("fs");
var final = "";
var file_names = [];
var args = {};
var _args = process.argv.splice(2, process.argv.length - 2);
for (var a of _args) {
	if (a.match(/=/g, "")) {
		args[a.split("=")[0].replace(/-/, "").replace(/-/g, "_")] = a.split("=")[1];
	} else {
		args[a.replace(/-/, "").replace(/-/g, "_")] = true;
	}
}
if (args.h || args.help || args._h || args._help) {
	console.log("takes a project file in and returns a custom minified output\n example: node packager -target=./test.project -out=packaged.js");
	return;
}
if (args.t || args._t || args.target || args._target) {
	var act = args.t || args._t || args.target || args._target;
	file_names = fs.readFileSync(act, {
		"encoding": "utf-8"
	}).split("\n").map(n => ("./" + n).replace(/[\n\r]/g, ""));
} else {
	console.log("failed to find target flag", args);
	return;
}
console.log(file_names);
var n = 0;
for (var url of file_names) {
	n++;
	var txt = fs.readFileSync(url, {
		encoding: "utf-8"
	});
	var preq = `\n/*
	*${url}
	*/\n`
	if (args.b || args.build || args._b || args._build) preq = "\n";
	final += preq + clean(txt) + ";";

	if (n === 1) {
		final += "build=() => {\n";
	}
}
final += "/*window.build=undefined*/;};build();";
var fn = "packed.min.js";
if (args.o || args.out || args.output || args._o || args._out || args._output) {
	fn = args.o || args.out || args.output || args._o || args._out || args._output;
}
fs.writeFileSync(fn, final);

function clean(str) {
	str = str.replace(/\/\/.+\n/gm, "/*$&*/");
	str = str.replace(/}\n/g, "};\n");
	str = str.replace(/[\n\r\t]/g, "");
	str = str.replace(/}[\s\n\r]*?([a-zA-Z$_.]+?\(\);)/g, "};$1");
	return str;
}