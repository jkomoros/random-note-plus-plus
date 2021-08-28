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
		const fileChildren = folder.children.filter(item => !item.children);
		if (fileChildren.length == 0) {
			throw new Error('No direct children of that folder');
		}
		const randomChild = fileChildren[Math.floor(Math.random()*fileChildren.length)]
		this.app.workspace.activeLeaf.openFile(randomChild);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS);
	}
}

module.exports = RandomInFolderPlugin;