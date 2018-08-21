var nodeResolve = require("rollup-plugin-node-resolve");
var uglify = require("rollup-plugin-uglify").uglify;

export default {
	input: "src/index.js",
	output: {
		file: "template.js",
		name: "template",
		sourcemap: true,
		format: "iife"
	},
	plugins: [
		nodeResolve({ jsnext: true }),
		uglify(),
	]
};
