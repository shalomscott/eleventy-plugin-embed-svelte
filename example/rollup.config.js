// This file is optional. If present, this plugin will load it and
// look for the config with the input 'embedSvelte' and use the
// corresponding Rollup configuration while bundling Svelte components.

const { terser } = require('rollup-plugin-terser');

export default {
	input: 'embedSvelte',
	// Additional input plugins (Optional)
	plugins: [],
	output: {
		// Additional output plugins (Optional)
		plugins: [terser()]
	}
};
