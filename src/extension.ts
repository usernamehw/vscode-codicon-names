import https from 'https';
import { iconNames } from 'src/iconNames';
import { commands, ExtensionContext, QuickPickItem, SnippetString, window, workspace } from 'vscode';

const enum Constants {
	extensionName = 'codiconNames',
	lastIconFetchDateStorageKey = 'LAST_ICON_FETCH_DATE',
	cachedIconsStorageKey = 'CACHED_ICONS',
	codiconRepository = 'https://raw.githubusercontent.com/microsoft/vscode-codicons/master/dist/codicon.csv',
}

interface ExtensionConfig {
	fetchNewest: boolean;
}

function isToday(date: Date) {
	return new Date().toDateString() === date.toDateString();
}
export const sleep = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

let icons: string[] = iconNames;
let fetchingInProgress = false;

export function activate(context: ExtensionContext) {
	const lastFetch: string | undefined = context.globalState.get(Constants.lastIconFetchDateStorageKey);

	if ((workspace.getConfiguration(Constants.extensionName) as any as ExtensionConfig).fetchNewest) {
		if (lastFetch === undefined || !isToday(new Date(lastFetch))) {
			fetchingInProgress = true;
			https.get(Constants.codiconRepository, response => {
				let data = '';
				response.on('data', chunk => {
					data += chunk;
				});
				response.on('end', () => {
					const parsedIcons = data
						.toString()
						.split('\n')
						.slice(1)
						.map(line => line.split(',')[0]);

					context.globalState.update(Constants.lastIconFetchDateStorageKey, new Date().toString());
					context.globalState.update(Constants.cachedIconsStorageKey, parsedIcons);
					icons = parsedIcons;
					fetchingInProgress = false;
				});
			}).on('error', err => {
				throw err;
			});
		} else {
			icons = context.globalState.get(Constants.cachedIconsStorageKey) || [];
		}
	}

	// ──────────────────────────────────────────────────────────────────────
	commands.registerTextEditorCommand('codiconNames.insert', async editor => {
		if (fetchingInProgress) {
			await sleep(500);
		}
		if (fetchingInProgress) {
			await sleep(1000);
		}
		if (fetchingInProgress) {
			await sleep(2000);
		}
		const pickedIcon = await window.showQuickPick(icons.map(icon => ({
			label: icon,
			description: `$(${icon})`,
		} as QuickPickItem)));
		if (pickedIcon) {
			editor.insertSnippet(new SnippetString(pickedIcon.label));
		}
	});
}
