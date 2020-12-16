const https = require('https');
const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const file = fs.createWriteStream("./scripts/icons.csv");
const request = https.get("https://raw.githubusercontent.com/microsoft/vscode-codicons/master/dist/codicon.csv", (response) => {
	response.pipe(file);
	file.on('finish', () => {
		console.log('✅');
		fs.createReadStream('./scripts/icons.csv')
			.pipe(csv())
			.on('data', (data) => results.push(data))
			.on('end', () => {
				const iconNames = results.map(item => item.short_name);
				fs.writeFile('./scripts/icons.json', JSON.stringify(iconNames), (err) => {
					if (err) throw err;
				});
			});
	})
}).on('error', (err) => {
	fs.unlink(dest);
	throw err;
});