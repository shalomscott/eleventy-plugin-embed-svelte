'use strict';

import { Plugin, rollup } from 'rollup';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import virtual from '@rollup/plugin-virtual';
import cheerio from 'cheerio';

type Component = { index: number; inputPath: string; props: any };
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
		props: any
	) {
		let index;
		inputPath = `${svelteDir}/${inputPath}`; // TODO: CHECK!
		if (!componentMap[this.page.outputPath]) {
			index = 0;
			componentMap[this.page.outputPath] = [{ index, inputPath, props }];
		} else {
			index = componentMap[this.page.outputPath].length;
			componentMap[this.page.outputPath].push({ index, inputPath, props });
		}
		return `<div id="svelte-embed-${index}"></div>`;
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
	const seen: any = {};
	return componentsArray
		.filter(({ inputPath }) => {
			if (seen[inputPath]) return false;
			seen[inputPath] = true;
			return true;
		})
		.map(
			({ index, inputPath }) =>
				`export { default as Component${index} } from '${inputPath}';`
		)
		.join('');
}

function initCode(componentsArray: Component[]) {
	return componentsArray
		.map(
			({ index, props }) =>
				`new EmbedSvelte.Component${index}({ target: document.getElementById('svelte-embed-${index}'), props: ${JSON.stringify(
					props
				)} });`
		)
		.join('');
}
