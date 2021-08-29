const obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
	folder: ''
}

const MAIN_COMMAND_NAME = 'Open random note';
const CONFIGURED_FOLDER_COMMAND_NAME = MAIN_COMMAND_NAME + ' in configured folder';
const CURRENT_FOLDER_COMMAND_NAME = MAIN_COMMAND_NAME + ' in current folder';
const RIBBON_COMMAND_STRING = MAIN_COMMAND_NAME + ' (⇧ to restrict to current folder, or ⎇ to restrict to configured folder)';

class RandomInFolderPlugin extends obsidian.Plugin {

	async onload() {

		await this.loadSettings();

		this.addRibbonIcon('dice', RIBBON_COMMAND_STRING, (evt) => {
			if (evt.shiftKey) {
				this.currentFolderAction();
			} else if(evt.altKey) {
				this.configuredFolderAction();
			} else {
				this.mainAction();
			}
		});

		this.addSettingTab(new RandomInFolderSettingsTab(this.app, this));

		this.addCommand({
			id: 'random-note-in-configured-folder',
			name: CONFIGURED_FOLDER_COMMAND_NAME,
			callback: () => this.configuredFolderAction(),
			hotkeys: [
				{
					modifiers:['Mod', 'Alt'],
					key: 'r',
				}
			]
		});

		this.addCommand({
			id: 'random-note',
			name: MAIN_COMMAND_NAME,
			callback: () => this.mainAction(),
			hotkeys: [
				{
					modifiers:['Mod'],
					key: 'r',
				}
			]
		})

		this.addCommand({
			id: 'random-note-in-current-folder',
			name: CURRENT_FOLDER_COMMAND_NAME,
			checkCallback: (checking) => {
				if (checking) {
					if (this.folderOfActiveLeaf()) return true;
					return false;
				}
				this.currentFolderAction();
				return true;
			},
			hotkeys: [
				{
					modifiers:['Mod', 'Shift'],
					key: 'r',
				}
			]
		});
	}

	mainAction() {
		const folder = this.app.vault.getAbstractFileByPath('/');
		this.navigateToRandomNoteInFolder(folder);
	}

	configuredFolderAction() {
		const folder = this.app.vault.getAbstractFileByPath(this.settings.folder || '/');
		this.navigateToRandomNoteInFolder(folder);
	}

	currentFolderAction() {
		const folder = this.folderOfActiveLeaf();
		this.navigateToRandomNoteInFolder(folder);
	}

	folderOfActiveLeaf() {
		if (!this.app.workspace.activeLeaf) {
			return null;
		}
		const activeLeaf = this.app.workspace.activeLeaf;
		if (!activeLeaf.view.file) {
			return null;
		}
		return activeLeaf.view.file.parent;
	}

	navigateToRandomNoteInFolder(folder) {
		if (!folder || !folder.children) {
			new Notice('Invalid folder.');
			return;
		}
		const randomChild = this.randomFileInFolder(folder);
		if (!randomChild) {
			new Notice('No files in that folder.');
			return;
		}
		this.app.workspace.activeLeaf.openFile(randomChild);
	}

	descendantFilesInFolder(folder) {
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
			return null;
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