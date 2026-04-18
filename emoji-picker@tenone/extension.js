const Main = imports.ui.main;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;

let popup = null;
let overlay = null;
let hotkeyName = "emoji-picker-toggle";
let modalGrabbed = false;
const EMOJIS = [
    { emoji: "🙂", name: "smile happy" },
    { emoji: "😂", name: "laugh joy funny" },
    { emoji: "❤️", name: "heart love" },
    { emoji: "🚀", name: "rocket launch" },
    { emoji: "🔥", name: "fire hot" }
];

function init() {
}

function copyToClipboard(text) {
    try {
        St.Clipboard.get_default().set_text(St.ClipboardType.CLIPBOARD, text);
        global.log(`Emoji Picker copied: ${text}`);
    } catch (e) {
        global.logError(e);
    }
}

function releaseModal() {
    try {
        if (modalGrabbed && popup) {
            Main.popModal(popup);
        }
    } catch (e) {
        global.logError(e);
    } finally {
        modalGrabbed = false;
    }
}

function closePopup() {
    try {
        releaseModal();

        if (overlay) {
            overlay.destroy();
            overlay = null;
        }

        if (popup) {
            popup.destroy();
            popup = null;
        }
    } catch (e) {
        global.logError(e);
    }
}

function createEmojiButton(emoji, labelText) {
    let button = new St.Button({
        reactive: true,
        can_focus: true,
        track_hover: true,
        style: `
            min-width: 52px;
            min-height: 52px;
            margin: 4px;
            border-radius: 10px;
            background-color: rgba(255,255,255,0.08);
            font-size: 1.5em;
        `
    });

    let emojiLabel = new St.Label({
        text: emoji,
        reactive: false,
        style: "font-size: 1.5em; text-align: center;"
    });

    button.set_child(emojiLabel);

    button.connect("clicked", () => {
        global.log(`Emoji button clicked: ${emoji}`);
        copyToClipboard(emoji);
        Main.notify("Emoji Picker", `Copié : ${emoji}`);
        closePopup();
    });

    return button;
}

function showPopup() {
    try {
        closePopup();

        let monitor = Main.layoutManager.primaryMonitor;

        overlay = new St.Widget({
            reactive: true,
            x: monitor.x,
            y: monitor.y,
            width: monitor.width,
            height: monitor.height,
            style: "background-color: rgba(0,0,0,0.001);"
        });

        overlay.connect("button-press-event", () => {
            closePopup();
            return Clutter.EVENT_STOP;
        });

        popup = new St.BoxLayout({
            vertical: true,
            reactive: true,
            can_focus: true,
            track_hover: true,
            style: `
                padding: 20px;
                spacing: 10px;
                min-width: 320px;
                background-color: #2b2b2b;
                color: white;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.12);
            `
        });

        let title = new St.Label({
            text: "Emoji Picker",
            style: "font-size: 1.2em; font-weight: bold;"
        });

        let subtitle = new St.Label({
            text: "Choisis un emoji",
            style: "font-size: 0.95em; color: #cfcfcf;"
        });

        let searchEntry = new St.Entry({
            hint_text: "Rechercher…",
            can_focus: true,
            track_hover: true,
            style: `
                padding: 8px 10px;
                border-radius: 8px;
                margin-top: 8px;
            `
        });

        let listContainer = new St.BoxLayout({
            vertical: true,
            style: "margin-top: 8px;"
        });

        renderList(listContainer, EMOJIS);

        searchEntry.clutter_text.connect("text-changed", () => {
            let text = searchEntry.get_text();
            let results = filterEmojis(text);
            renderList(listContainer, results);
        });


        let closeButton = new St.Button({
            label: "Fermer",
            reactive: true,
            can_focus: true,
            track_hover: true,
            style: `
                padding: 10px 12px;
                margin-top: 14px;
                border-radius: 8px;
                background-color: rgba(255,255,255,0.16);
                color: white;
                font-weight: bold;
            `
        });

        closeButton.connect("clicked", () => {
            closePopup();
        });

        popup.add_child(title);
        popup.add_child(subtitle);
        popup.add_child(searchEntry);
        popup.add_child(listContainer);
        // popup.add_child(emoji1);
        // popup.add_child(emoji2);
        // popup.add_child(emoji3);
        popup.add_child(closeButton);


        Main.uiGroup.add_child(overlay);
        Main.uiGroup.add_child(popup);

        
        let popupWidth = 320;
        let popupHeight = 340;
        let margin = 32;

        popup.set_position(
            Math.floor(monitor.x + monitor.width - popupWidth - margin),
            Math.floor(monitor.y + monitor.height - popupHeight - margin - 40)
        );

        Main.pushModal(popup);
        modalGrabbed = true;

        global.stage.set_key_focus(closeButton);

    } catch (e) {
        global.logError(e);
        Main.notify("Emoji Picker", `Erreur popup: ${e.message}`);
        closePopup();
    }
}

function renderList(container, items) {
    container.destroy_all_children();

    let columns = 4;
    let row = null;

    items.forEach((item, index) => {
        if (index % columns === 0) {
            row = new St.BoxLayout({
                vertical: false,
                style: "spacing: 6px;"
            });
            container.add_child(row);
        }

        row.add_child(createEmojiButton(item.emoji, item.name));
    });
}

function filterEmojis(query) {
    let q = query.toLowerCase();

    return EMOJIS.filter(e =>
        e.name.includes(q)
    );
}

function togglePopup() {
    try {
        if (popup) {
            closePopup();
        } else {
            showPopup();
        }
    } catch (e) {
        global.logError(e);
        Main.notify("Emoji Picker", `Erreur toggle: ${e.message}`);
    }
}

function registerHotkey() {
    try {
        Main.keybindingManager.addHotKey(
            hotkeyName,
            "<Super>semicolon",
            () => {
                togglePopup();
            }
        );
        global.log("Emoji Picker hotkey registered");
    } catch (e) {
        global.logError(e);
        Main.notify("Emoji Picker", `Erreur raccourci: ${e.message}`);
    }
}

function unregisterHotkey() {
    try {
        Main.keybindingManager.removeHotKey(hotkeyName);
    } catch (e) {
        global.logError(e);
    }
}

function enable() {
    try {
        Main.notify("Emoji Picker", "Extension loaded 🚀");
        registerHotkey();
        showPopup();
    } catch (e) {
        global.logError(e);
        Main.notify("Emoji Picker", `Erreur enable: ${e.message}`);
    }
}

function disable() {
    unregisterHotkey();
    closePopup();
}