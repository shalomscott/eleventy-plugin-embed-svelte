const embedSvelte = require('../').default;
const { terser } = require('rollup-plugin-terser'); // Optional custom plugin for rollup

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(embedSvelte, {
		// This is the directory that contains your *.svelte component files
		svelteDir: './svelte',
		// an optional array of input plugins
		inputPlugins: [],
		// an optional array of output plugins
		outputPlugins: [terser()]
	});

	return {
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk'
	};
};
