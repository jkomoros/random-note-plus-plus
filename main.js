const obsidian = require('obsidian');

class RandomInFolderPlugin extends obsidian.Plugin {

	async onload() {
		console.log('loading plugin');

		this.addCommand({
			id: 'hello-world',
			name: 'Hello world',
		callback: () => {
			console.log('Simple Callback');
		}
		});
	}

	onunload() {
		console.log('unloading plugin');
	}
}

module.exports = RandomInFolderPlugin;