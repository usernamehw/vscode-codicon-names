// @ts-check
const https = require('https');
const fs = require('fs');

const csvPath = './scripts/icons.csv';
const file = fs.createWriteStream(csvPath);
const request = https.get('https://raw.githubusercontent.com/microsoft/vscode-codicons/master/dist/codicon.csv', (response) => {
	response.pipe(file);
	file.on('finish', () => {
		console.log('✅  "icons.csv" downloaded');
		fs.readFile(csvPath, (err, data) => {
			if (err) {
				throw err;
			}
			const lines = data
				.toString()
				.split('\n')
				.map(line => line.split(',')[0]);
			fs.writeFile('./src/iconNames.ts', `export const iconsNames = ${JSON.stringify(lines)};`, (err) => {
				if (err) {
					throw err;
				}
				console.log('✅  "iconNames.ts" written')
			})
		})
	})
}).on('error', (err) => {
	throw err;
});