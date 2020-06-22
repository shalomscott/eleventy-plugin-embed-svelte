# Installation

[Install the plugin](https://www.11ty.dev/docs/plugins/#adding-a-plugin) through npm:

```sh
npm install -s eleventy-plugin-embed-svelte
```

Then add it to your [Eleventy config](https://www.11ty.dev/docs/config/) file:

```javascript
const embedSvelte = require('eleventy-plugin-embed-svelte');
const { terser } = require('rollup-plugin-terser'); // Optional plugin for rollup

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(embedSvelte, {
		// This is the directory that contains your *.svelte component files
		svelteDir: './svelte',
		// an optional array of input plugins
		inputPlugins: [],
		// an optional array of output plugins
		outputPlugins: [terser()]
	});

	// Rest of config file...
};
```

# Usage

To embed Svelte components, drop in `svelte` tags.

## example:

```html
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula, elit vel
condimentum porta, purus.

<svelte
	name="MyComponent"
	someProp="some prop that the component exposes"
></svelte>

Maecenas non velit nibh. Aenean eu justo et odio commodo ornare. In scelerisque
sapien at.
```

## explanation:

This plugin's main feature is an [Eleventy Transform](https://www.11ty.dev/docs/config/#transforms) that scans all output HTML for `svelte` tags. For each tag, the plugin looks for the "name" attribute in order to compile the file `${svelteDir}/${name}.svelte`. All other attributes on the `svelte` tag are supplied to the component as `props`. The output HTML is then modified to contain, inline, all the bundled code, and code to instantiate the Svelte components.

# Other Notes

- This plugin adds the Svelte component directory ("svelteDir") to Eleventy's list of [watch targets](https://www.11ty.dev/docs/config/#add-your-own-watch-targets).

- This is something I threw together in a couple hours to use in a project of mine. As such it is shamefully incomplete and unpolished. All contributions welcome 😃!
