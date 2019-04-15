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
		uglify()
	],
	onwarn: function (warning, warn) {
			if (warning.code === "CIRCULAR_DEPENDENCY") return;
			if (warning.code === "UNRESOLVED_IMPORT") {
					throw new Error(
							"Couldn't resolve the dependency " + warning.source +
									" (from " + warning.importer + "): sometimes you can" +
									" fix this with 'npm install', or add '" + warning.source +
									" to 'external'. See: " + warning.url
					);
			}
			warn(warning);
	}
};
