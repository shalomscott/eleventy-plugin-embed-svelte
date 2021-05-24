'use strict';

import resolve from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import cheerio from 'cheerio';
import path from 'path';
import { Plugin, rollup } from 'rollup';
import svelte, { Options as SvelteOptions } from 'rollup-plugin-svelte';
import { getRollupOptions } from './utils/config';
import { getBaseName } from './utils/paths';

type Component = {
	fileName: string;
	instances: { props: unknown }[];
};
type ComponentMap = { [outputPath: string]: Record<string, Component> };
type Options = {
	svelteDir?: string;
	rollupPluginSvelteOptions?: Partial<SvelteOptions>;
};

export = function (
	eleventyConfig: any,
	{ svelteDir = '', rollupPluginSvelteOptions = {} }: Options
) {
	let componentMap: ComponentMap = {};

	eleventyConfig.addShortcode(
		'embedSvelte',
		function (fileName: string, props: unknown) {
			fileName = path.resolve(svelteDir, fileName);
			let name = getBaseName(fileName);
			let instanceIndex: number;
			if (!componentMap[this.page.outputPath]) {
				instanceIndex = 0;
				componentMap[this.page.outputPath] = {
					[name]: { fileName, instances: [{ props }] }
				};
			} else {
				const components = componentMap[this.page.outputPath];
				if (components[name]) {
					instanceIndex = components[name].instances.length;
					components[name].instances.push({ props });
				} else {
					instanceIndex = 0;
					components[name] = {
						fileName,
						instances: [{ props }]
					};
				}
			}
			return `<div id="svelte-embed-${name}${instanceIndex}"></div>`;
		}
	);

	eleventyConfig.addTransform(
		'embed-svelte',
		async function (content: string, outputPath: string) {
			if (componentMap[outputPath]) {
				const $ = cheerio.load(content);

				const optionsGetter = await getRollupOptions('embedSvelte');
				const inputOptions = optionsGetter.inputOptions({
					plugins: [resolve()]
				});
				const outputOptions = optionsGetter.outputOptions();

				const bundle = await rollup({
					...inputOptions,
					input: 'entry',
					plugins: [
						...(inputOptions.plugins ?? []),
						virtual({
							entry: virtualEntry(componentMap[outputPath])
						}) as Plugin,
						svelte({
							...rollupPluginSvelteOptions,
							emitCss: false
						})
					]
				});

				const build = await bundle.generate({
					...outputOptions,
					format: 'iife',
					name: 'EmbedSvelte'
				});

				await bundle.close();

				// Assuming no 'assets' are generated
				let code = build.output[0].code;
				// Covers edge case (see https://stackoverflow.com/q/36607932/4998195)
				code = code.replace('</script>', '<\\/script>');

				const body = $('body');
				body.append(`\n<script>\n${code}</script>`);
				body.append(
					`\n<script>\n${initCode(componentMap[outputPath])}\n</script>\n`
				);

				return $.html();
			}

			return content;
		}
	);

	eleventyConfig.addWatchTarget(svelteDir);
	eleventyConfig.on('beforeWatch', () => (componentMap = {}));
};

function virtualEntry(components: Record<string, Component>) {
	return Object.entries(components)
		.map(
			([name, { fileName }]) =>
				`export { default as ${name} } from '${fileName}';`
		)
		.join('');
}

function initCode(components: Record<string, Component>) {
	return Object.entries(components)
		.flatMap(([name, { instances }]) =>
			instances.map(
				({ props }, instanceIndex) =>
					`new EmbedSvelte.${name}({\n\ttarget: document.getElementById('svelte-embed-${name}${instanceIndex}'),\n\tprops: ${JSON.stringify(
						props
					)}\n});`
			)
		)
		.join('\n');
}
