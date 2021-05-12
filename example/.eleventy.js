const embedSvelte = require('../').default;
const sveltePreprocess = require('svelte-preprocess'); // Optional
const { terser } = require('rollup-plugin-terser'); // Optional

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(embedSvelte, {
		// Directory that hosts your *.svelte component files. (Optional)
		svelteDir: './svelte',
		// Options that you may pass to rollup-plugin-svelte. (Optional)
		rollupPluginSvelteOptions: { preprocess: sveltePreprocess() },
		// Array of Rollup input plugins. (Optional)
		rollupInputPlugins: [],
		// Array of Rollup output plugins. (Optional)
		rollupOutputPlugins: [terser()],
		// Options that you may pass to @rollup/plugin-node-resolve. (Optional)
		rollupResolveOptions: {}
	});

	return {
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk'
	};
};
