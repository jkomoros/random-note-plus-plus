const obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
	folder: 'daily'
}

class RandomInFolderPlugin extends obsidian.Plugin {

	async onload() {

		await this.loadSettings();

		this.addCommand({
			id: 'random-note-in-folder',
			name: 'Random Note in Folder',
		callback: () => {
			this.action();
		}
		});
	}

	action() {
		console.log('Running');
		const folder = this.app.vault.getAbstractFileByPath(this.settings.folder);
		if (!folder) {
			throw new Error('No such folder');
		}
		if (!folder.children) {
			throw new Error('Not a folder');
		}
		//TODO: do something with children.
		console.log(folder.children);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS);
	}
}

module.exports = RandomInFolderPlugin;