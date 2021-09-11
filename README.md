# Random Note++

Random Note++ is a plugin for Obisidian.md that replicates the built-in Random note, but adding the ability to select a random file in the current directory, or in a pre-configured folder.

## Features

This plugin adds three commands, which you can run from the command pane or by assigning a hotkey. All of the commands will select files that are in the folder in question or anywhere in descendants.
- **Open random note** - (Default: ⌘R) The same behavior as the built-in Open random note. Opens a random file anywhere within the root folder or descendants.
- **Open random note in current folder** - (Default: ⌘⇧R) Opens a random note that is in the same folder as the file pane that is currently active. Not available unless the active pane is a file.
- **Open random note in configured folder** - (Default: ⌘⎇R) Opens a random note that is in the folder that is preconfigured in settings. Open settings and put in a foldername. For example, you could configure `daily` if your daily notes are in that folder and you want to randomly select a daily note.

The plugin also installs an icon in the ribbon. Click it to open a random note. Press Ctrl/Cmd and click for a random note in the pre-configured folder. Press Alt and click for a random note in the current folder.

See DEVELOPING.md in this repo for instructions on how to install this plugin manually.