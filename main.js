const obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
	folder: '/'
}

class RandomInFolderPlugin extends obsidian.Plugin {

	async onload() {

		await this.loadSettings();

		this.addSettingTab(new RandomInFolderSettingsTab(this.app, this));

		this.addCommand({
			id: 'random-note-in-folder',
			name: 'Open random note in configured folder',
			callback: () => this.action(),
		});
	}

	action() {
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
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class RandomInFolderSettingsTab extends obsidian.PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		let {containerEl} = this;

		containerEl.empty();

		new obsidian.Setting(containerEl)
			.setName('Folder')
			.setDesc('The folder you want to show random notes from. Leave as \'/\' for top-level notes.')
			.addText(text => text
				.setValue(this.plugin.settings.folder)
				.setPlaceholder('Example: foldername')
				.onChange(async (value) => {
					this.plugin.settings.folder = value;
					await this.plugin.saveSettings();
				}));
	}
}

module.exports = RandomInFolderPlugin;