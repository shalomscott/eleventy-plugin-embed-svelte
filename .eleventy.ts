'use strict';

import path from 'path';
import { Plugin, rollup } from 'rollup';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import cheerio from 'cheerio';

type Component = {
	index: number;
	inputPath: string;
	instances: { props: unknown }[];
};
type ComponentMap = { [outputPath: string]: Component[] };

export default function (
	eleventyConfig: any,
	{
		svelteDir = '',
		inputPlugins = [],
		outputPlugins = []
	}: { svelteDir: string; inputPlugins: Plugin[]; outputPlugins: Plugin[] }
) {
	const componentMap: ComponentMap = {};

	eleventyConfig.addShortcode('embedSvelte', function (
		inputPath: string,
		props: unknown
	) {
		let index;
		let instanceIndex;
		inputPath = path.resolve(svelteDir, inputPath);
		if (!componentMap[this.page.outputPath]) {
			index = 0;
			instanceIndex = 0;
			componentMap[this.page.outputPath] = [
				{ index, inputPath, instances: [{ props }] }
			];
		} else {
			const components = componentMap[this.page.outputPath];
			index = components.findIndex(({ inputPath: ip }) => ip === inputPath);
			if (index > -1) {
				instanceIndex = components[index].instances.length;
				components[index].instances.push({ props });
			} else {
				index = components.length;
				instanceIndex = 0;
				components.push({
					index,
					inputPath,
					instances: [{ props }]
				});
			}
		}
		return `<div id="svelte-embed-${index}${instanceIndex}"></div>`;
	});

	eleventyConfig.addTransform('embed-svelte', async function (
		content: string,
		outputPath: string
	) {
		if (componentMap[outputPath]) {
			const $ = cheerio.load(content);

			const bundle = await rollup({
				input: 'entry',
				plugins: [
					virtual({ entry: virtualEntry(componentMap[outputPath]) }) as Plugin,
					resolve(),
					svelte({}),
					...inputPlugins
				]
			});

			const build = await bundle.generate({
				format: 'iife',
				name: 'EmbedSvelte',
				plugins: outputPlugins
			});

			// Assuming no 'assets' are generated
			const code = build.output[0].code;

			$('head').append(`<script>${code}</script>`);
			$('body').append(
				`<script>${initCode(componentMap[outputPath])}</script>`
			);

			return $.html();
		}

		return content;
	});

	eleventyConfig.addWatchTarget(svelteDir);
}

function virtualEntry(componentsArray: Component[]) {
	return componentsArray
		.map(
			({ index, inputPath }) =>
				`export { default as Component${index} } from '${inputPath}';`
		)
		.join('');
}

function initCode(componentsArray: Component[]) {
	return componentsArray
		.flatMap(({ index, instances }) =>
			instances.map(
				({ props }, instanceIndex) =>
					`new EmbedSvelte.Component${index}({ target: document.getElementById('svelte-embed-${index}${instanceIndex}'), props: ${JSON.stringify(
						props
					)} });`
			)
		)
		.join('');
}
