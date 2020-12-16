
import { iconsNames } from 'src/iconNames';
import { commands, QuickPickItem, SnippetString, window } from 'vscode';

export function activate(): void {
	commands.registerTextEditorCommand('codiconNames.insert', async editor => {
		const pickedIcon = await window.showQuickPick(iconsNames.map(icon => ({
			label: icon,
			description: `$(${icon})`,
		} as QuickPickItem)));
		if (pickedIcon) {
			editor.insertSnippet(new SnippetString(pickedIcon.label));
		}
	});
}
