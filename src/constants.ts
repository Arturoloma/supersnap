/**
 * Constants used throughout the SuperSnap extension
 */

/**
 * Command identifiers
 */
export const COMMANDS = {
    START: 'supersnap.start',
} as const;

/**
 * Configuration keys
 */
export const CONFIG_KEYS = {
    BACKGROUND_GRADIENT: 'supersnap.backgroundGradient',
    SAVED_PRESETS: 'supersnap.savedPresets',
    LAST_SELECTION: 'supersnap.lastSelection',
    SHOW_MAC_HEADER: 'supersnap.showMacHeader',
} as const;

/**
 * Default values
 */
const DEFAULT_ANGLE = 140;

export const DEFAULTS = {
    ANGLE: DEFAULT_ANGLE,
    GRADIENT: `linear-gradient(${DEFAULT_ANGLE}deg, rgb(165, 55, 253), rgb(33, 209, 244))`,
    FILE_NAME: 'code-snapshot.png',
    PASTE_DELAY_MS: 150,
    SHOW_MAC_HEADER: true,
} as const;

/**
 * Default Presets
 */
export const PRESETS = [
    { color1: '#a537fd', color2: '#21d1f4', angle: 140, label: 'Purple to blue', showMacHeader: true, isDefault: true },
    { color1: '#00dbde', color2: '#fc00ff', angle: 140, label: 'Cyan to magenta', showMacHeader: true, isDefault: true },
    { color1: '#11998e', color2: '#38ef7d', angle: 140, label: 'Teal to green', showMacHeader: true, isDefault: true }
];

/**
 * Webview configuration
 */
export const WEBVIEW = {
    VIEW_TYPE: 'supersnap',
    TITLE: 'SuperSnap',
} as const;

/**
 * File filters for save dialog
 */
export const FILE_FILTERS: { [name: string]: string[] } = {
    Images: ['png'],
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
    NO_ACTIVE_EDITOR: 'SuperSnap: No active editor found!',
    SAVE_FAILED: 'SuperSnap: Failed to save image',
} as const;
