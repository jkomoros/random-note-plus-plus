const obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
	folder: ''
}

class RandomInFolderPlugin extends obsidian.Plugin {

	async onload() {

		await this.loadSettings();

		this.addSettingTab(new RandomInFolderSettingsTab(this.app, this));

		this.addCommand({
			id: 'random-note-in-folder',
			name: 'Open random note in configured folder',
			callback: () => this.navigateToRandomNoteInFolderNamed(this.settings.folder),
		});

		this.addCommand({
			id: 'random-note',
			name: 'Open random note',
			callback: () => this.navigateToRandomNoteInFolderNamed('/'),
		})
	}

	navigateToRandomNoteInFolderNamed(folderName) {
		const folder = this.app.vault.getAbstractFileByPath(folderName);
		const randomChild = this.randomFileInFolder(folder);
		this.app.workspace.activeLeaf.openFile(randomChild);
	}

	descendantFilesInFolder(folder) {
		if (!folder) {
			throw new Error('No such folder');
		}
		if (!folder.children) {
			throw new Error('Not a folder');
		}
		const files = [];
		for (const item of folder.children) {
			if (item.children) {
				//Recurse into the sub-directory
				files.push(...this.descendantFilesInFolder(item));
			} else {
				files.push(item);
			}
		}
		return files;
	}

	randomFileInFolder(folder) {
		const fileChildren = this.descendantFilesInFolder(folder);
		if (fileChildren.length == 0) {
			throw new Error('No files in that folder');
		}
		return fileChildren[Math.floor(Math.random()*fileChildren.length)]
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
			.setName('Configured folder')
			.setDesc('The folder to use for the \'Open random note in configured folder\' option')
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