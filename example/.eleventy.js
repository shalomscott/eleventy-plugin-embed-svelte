const embedSvelte = require('../');
const sveltePreprocess = require('svelte-preprocess'); // Optional

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(embedSvelte, {
		// Directory that hosts your *.svelte component files. (Optional)
		svelteDir: './svelte',
		// Options that you may pass to rollup-plugin-svelte. (Optional)
		rollupPluginSvelteOptions: { preprocess: sveltePreprocess() }
	});

	return {
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk'
	};
};
