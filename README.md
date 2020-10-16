# 🎉 Embed Svelte Components in Your 11ty Site! 🎉

## Installation

[Install the plugin](https://www.11ty.dev/docs/plugins/#adding-a-plugin) through npm:

```sh
npm install eleventy-plugin-embed-svelte
```

Then add it to your [Eleventy config](https://www.11ty.dev/docs/config/) file, like this:

```javascript
module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(embedSvelte, {
        // Directory that hosts your *.svelte component file (Optional)
        svelteDir: './svelte',
        // Options that you may pass to rollup-plugin-svelte. (Optional)
        rollupPluginSvelteOptions: { preprocess: sveltePreprocess() },
        // Array of Rollup input plugins. (Optional)
        rollupInputPlugins: [],
        // Array of Rollup output plugins. (Optional)
        rollupOutputPlugins: [terser()]
    });

    // Rest of config file...
};
```

## Usage

To embed Svelte components, all you need to do is use the shortcode `embedSvelte`.

### Example

- `Greeter.svelte`

```svelte
<script>
    export let user;
</script>

<h1>Hello there {user}!</h1>
```

- `index.md`

```nunjucks
Here is our Greeter Svelte component, embedded right into this doc!

{% embedSvelte 'Greeter.svelte', { user: 'Zach Harris' } %}
```

**_It's as simple as that!_**

## Features

- A simple shortcode (`{% embedSvelte ... %}`) that allows you to easily embed any Svelte component and pass in `props`.
- An [Eleventy Transform](https://www.11ty.dev/docs/config/#transforms) that works behind the scenes. Performs a Rollup build for each page with embedded Svelte components and efficiently adds the code to the output HTML.
- Adds the `svelteDir` (see plugin's options above) to Eleventy's list of [watch targets](https://www.11ty.dev/docs/config/#add-your-own-watch-targets).
