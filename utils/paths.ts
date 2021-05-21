export function getBaseName(fileName: string): string {
	const match = fileName.match(/.*\/(.*)\./);
	if (!match) {
		throw Error(`Malformed fileName: ${fileName}`);
	}
	return match[1];
}
