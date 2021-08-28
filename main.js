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
		console.log(this.settings);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS);
	}
}

module.exports = RandomInFolderPlugin;