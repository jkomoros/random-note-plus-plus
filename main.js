const obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
	folder: ''
}

const MAIN_COMMAND_NAME = 'Open random note';
const CONFIGURED_FOLDER_COMMAND_NAME = MAIN_COMMAND_NAME + ' in configured folder';
const CURRENT_FOLDER_COMMAND_NAME = MAIN_COMMAND_NAME + ' in current folder';
const RIBBON_COMMAND_STRING = MAIN_COMMAND_NAME + ' (⌘ to restrict to configured folder, or ⎇ to restrict to current folder)'

class RandomInFolderPlugin extends obsidian.Plugin {

	async onload() {

		await this.loadSettings();

		this.addRibbonIcon('dice', RIBBON_COMMAND_STRING, (evt) => {
			if (evt.metaKey || evt.ctrlKey) {
				this.configuredFolderAction();
			} else if(evt.altKey) {
				this.currentFolderAction();
			} else {
				this.mainAction();
			}
		});

		this.addSettingTab(new RandomInFolderSettingsTab(this.app, this));

		this.addCommand({
			id: 'random-note-in-folder',
			name: CONFIGURED_FOLDER_COMMAND_NAME,
			callback: () => this.configuredFolderAction(),
		});

		this.addCommand({
			id: 'random-note',
			name: MAIN_COMMAND_NAME,
			callback: () => this.mainAction(),
		})

		this.addCommand({
			id: 'random-note-in-current-folder',
			name: CURRENT_FOLDER_COMMAND_NAME,
			checkCallback: (checking) => {
				if (checking) {
					if (this.folderNameOfActiveLeaf()) return true;
					return false;
				}
				this.currentFolderAction();
				return true;
			},
		});
	}

	mainAction() {
		this.navigateToRandomNoteInFolderNamed('/');
	}

	configuredFolderAction() {
		this.navigateToRandomNoteInFolderNamed(this.settings.folder || '/');
	}

	currentFolderAction() {
		const folderName = this.folderNameOfActiveLeaf();
		if (!folderName) {
			new Notice('Couldn\'t do that action.');
			return;
		}
		this.navigateToRandomNoteInFolderNamed(folderName);
	}

	folderNameOfActiveLeaf() {
		if (!this.app.workspace.activeLeaf) {
			return '';
		}
		const activeLeaf = this.app.workspace.activeLeaf;
		if (!activeLeaf.view.file) {
			return '';
		}
		const parentFolder = activeLeaf.view.file.parent;
		return parentFolder.path;
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
			.setDesc('The folder to use for the \'' + CONFIGURED_FOLDER_COMMAND_NAME +'\' option')
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