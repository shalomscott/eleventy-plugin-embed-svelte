import path from 'path';
import type { OutputOptions, Plugin, RollupOptions } from 'rollup';
//@ts-ignore
import loadConfigFile from 'rollup/dist/loadConfigFile';

type RollupConfig = RollupOptions & { output: OutputOptions[] };

const CONFIG_FILE_PATH = 'rollup.config.js';

export async function getRollupOptions(input: string): Promise<{
	inputOptions: ReturnType<typeof getRollupInputOptions>;
	outputOptions: ReturnType<typeof getRollupOutputOptions>;
}> {
	const configOptions = await getConfigFile();

	if (!configOptions) {
		return {
			inputOptions: getRollupInputOptions({}),
			outputOptions: getRollupOutputOptions({})
		};
	}

	const options = configOptions.find((o) => o.input === input);

	if (!options) {
		throw new Error(
			`No config found in ${CONFIG_FILE_PATH} for input: ${input}`
		);
	}

	if (options.output.length > 1) {
		throw new Error(
			`An array of output options is not supported for input: ${input}`
		);
	}

	const { output, ...inputOptions } = options;
	const [outputOptions] = output;

	return {
		inputOptions: getRollupInputOptions(inputOptions),
		outputOptions: getRollupOutputOptions(outputOptions)
	};
}

async function getConfigFile(): Promise<RollupConfig[] | void> {
	try {
		const {
			options,
			warnings
		}: {
			options: RollupConfig[];
			warnings: { flush: Function };
		} = await loadConfigFile(path.resolve(CONFIG_FILE_PATH));
		// This prints all deferred warnings
		warnings.flush();
		return options;
	} catch {}
}

function getRollupInputOptions(configOptions: RollupOptions) {
	return (defaultInputOptions: RollupOptions = {}): RollupOptions => {
		const inputPlugins = mergePlugins(
			defaultInputOptions.plugins ?? [],
			configOptions.plugins ?? []
		);
		return { ...defaultInputOptions, ...configOptions, plugins: inputPlugins };
	};
}

function getRollupOutputOptions(configOptions: OutputOptions) {
	return (defaultOutputOptions: OutputOptions = {}): OutputOptions => {
		const outputPlugins = mergePlugins(
			defaultOutputOptions.plugins ?? [],
			configOptions.plugins ?? []
		);
		return {
			...defaultOutputOptions,
			...configOptions,
			plugins: outputPlugins
		};
	};
}

/** Merge Rollup Plugin arrays. Later arrays take precedence. */
function mergePlugins(...pluginsArrays: Plugin[][]): Plugin[] {
	const pluginsObjects: Record<string, Plugin>[] = pluginsArrays.map(
		(plugins) =>
			plugins.reduce(
				(pluginsObject: Record<string, Plugin>, plugin: Plugin) =>
					Object.assign(pluginsObject, { [plugin.name]: plugin }),
				{}
			)
	);
	return Object.values(Object.assign({}, ...pluginsObjects));
}
