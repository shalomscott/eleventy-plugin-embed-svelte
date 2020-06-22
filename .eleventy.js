'use strict';

const rollup = require('rollup');
const svelte = require('rollup-plugin-svelte');
const resolve = require('@rollup/plugin-node-resolve').default;
const virtual = require('@rollup/plugin-virtual');
const cheerio = require('cheerio');

module.exports = function (
	config,
	{ svelteDir, inputPlugins = [], outputPlugins = [] }
) {
	config.addTransform('embed-svelte', async function (content, outputPath) {
		if (outputPath.endsWith('.html')) {
			const $ = cheerio.load(content);
			const components = [];

			$('svelte').each((index, element) => {
				const { name, ...props } = element.attribs;
				components.push({ name, file: `${svelteDir}/${name}.svelte`, props });
				$(element).replaceWith(`<div id="svelte-embed-${index}"></div>`);
			});

			const bundle = await rollup.rollup({
				input: 'entry',
				plugins: [
					virtual({ entry: virtualEntry(components) }),
					resolve(),
					svelte(),
					...inputPlugins
				]
			});

			const build = await bundle.generate({
				format: 'iife',
				name: 'SvelteEmbed',
				plugins: outputPlugins
			});

			// Assuming no 'assets' are generated
			const code = build.output[0].code;

			$('head').append(`<script>${code}</script>`);
			$('body').append(`<script>${initCode(components)}</script>`);

			return $.html();
		}

		return content;
	});

	config.addWatchTarget(svelteDir);
};

function virtualEntry(componentsArray) {
	const seen = {};
	return componentsArray
		.filter(({ name }) => {
			if (seen[name]) return false;
			seen[name] = true;
			return true;
		})
		.map(({ name, file }) => `export { default as ${name} } from '${file}';`)
		.join('');
}

function initCode(componentsArray) {
	return componentsArray
		.map(
			({ name, props }, index) =>
				`new SvelteEmbed.${name}({ target: document.getElementById('svelte-embed-${index}'), props: ${JSON.stringify(
					props
				)} });`
		)
		.join('');
}
