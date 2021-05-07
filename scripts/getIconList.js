// @ts-check
const https = require('https');
const fs = require('fs');

https.get('https://raw.githubusercontent.com/microsoft/vscode-codicons/master/dist/codicon.csv', (response) => {
	let data = '';
	response.on('data', chunk => {
		data += chunk;
	});
	response.on('end', () => {
		console.log('✅  downloaded');
		const lines = data
			.toString()
			.split('\n')
			.slice(1)
			.map(line => line.split(',')[0]);
		fs.writeFile('./src/iconNames.ts', `export const iconNames = ${JSON.stringify(lines)};`, (err) => {
			if (err) {
				throw err;
			}
			console.log('✅  "iconNames.ts" written')
		})
	});
}).on('error', (err) => {
	throw err;
});