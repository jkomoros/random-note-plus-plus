# obisidian-random-in-folder
A simple plugin for Obsidian.md that is like Random Note but will only pick notes in a given folder

## Installing

Open Obsidian. Go to Settings > Community Plugins. Turn off Safe Mode, accepting the scary option in the dialog.

Within your filesytem, navigate to `$VAULT_DIR/.obsidian/plugins/` (creating the plugins directory if it doesn't exist).

`git clone` this repo.

Restart Obsidian and go to Community Plugins and enable `Random in folder`.

It defaults to the root folder. You can change it by going to `Random in folder` in Plugin Options section of settings, setting to, for example, `daily` to only select random notes in the `daily` folder.

Go to Hotkeys and assign `Random in folder: Open random note in configured folder` to a hotkey. (You can also trigger it via the command palette).