# Emoji Picker for Cinnamon

A lightweight emoji picker for Linux Mint (Cinnamon), inspired by the Windows `Win + ;` shortcut.

## Features

- Global shortcut: `Super + ;`
- Popup UI (bottom-right of screen)
- Emoji grid display
- Live search
- Clipboard copy on click
- Modal overlay (no click-through issues)

## Status

Work in progress – already usable, but evolving.

## Compatibility

- Tested on Cinnamon 6.6
- X11 session recommended

## Installation (local)

```bash
mkdir -p ~/.local/share/cinnamon/extensions/emoji-picker@tenone
```

Copy the extension files into:
~/.local/share/cinnamon/extensions/emoji-picker@tenone
Then enable it in Cinnamon settings.

## Usage
Press Super + ; to open/close the picker
Type to search
Click an emoji to copy it
Paste with Ctrl + V

## Debug
tail -f ~/.xsession-errors

## Roadmap
Scrollable grid
Full emoji dataset
Auto-paste (xdotool)
Favorites / recent emojis
Settings (custom shortcut)
UI polish (CSS cleanup)

## License
MIT