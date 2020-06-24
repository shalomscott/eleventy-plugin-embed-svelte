# Installation

[Install the plugin](https://www.11ty.dev/docs/plugins/#adding-a-plugin) through npm:

```sh
npm install eleventy-plugin-embed-svelte
```

Then add it to your [Eleventy config](https://www.11ty.dev/docs/config/) file:

```javascript
const embedSvelte = require('eleventy-plugin-embed-svelte');
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

    // Rest of config file...
};
```

# Usage

To embed Svelte components, drop in `svelte` tags.

## example

### Greeter.svelte

```html
<script>
    export let user;
</script>

<h1>Hello there {user}!</h1>
```

### index.html

```html
<p>Here is a custom tailored Svelte component, embedded right into this doc!</p>

<svelte
    name="Greeter"
    user="Zach Harris"
></svelte>

<p>Ain't that nice?</p>
```

## explanation

This plugin's main feature is an [Eleventy Transform](https://www.11ty.dev/docs/config/#transforms) that scans all output HTML for `svelte` tags. For each tag, the plugin looks for the `name` attribute in order to compile the file `${svelteDir}/${name}.svelte`. All other attributes on the `svelte` tag are interpreted as `props` of the component. The output HTML is then modified to contain, inline, all the bundled code, and code to instantiate the Svelte components.

# Features

- An [Eleventy Transform](https://www.11ty.dev/docs/config/#transforms) that scans all files built by Eleventy for `svelte` tags, and builds + embeds the corresponding Svelte component files. (Any file type that is built to HTML can use this - e.g. Markdown)
- Adds the `svelteDir` (Svelte component directory) to Eleventy's list of [watch targets](https://www.11ty.dev/docs/config/#add-your-own-watch-targets).

# Side Note

This plugin is something I threw together in a couple of hours to use in a project of mine. As such, it is shamefully incomplete. All contributions welcome 😃!
