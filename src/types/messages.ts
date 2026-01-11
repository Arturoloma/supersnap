/**
 * Message types for communication between extension and webview
 */

/**
 * Message sent from webview to extension to save an image
 */
export interface SaveImageMessage {
    command: 'saveImage';
    data: string; // Base64 encoded image data
}

/**
 * Message sent from webview to extension to save a configuration
 */
export interface SaveConfigMessage {
    command: 'saveConfiguration';
    data: GradientPreset;
}

/**
 * Message sent from webview to extension to remove a configuration
 */
export interface RemoveConfigMessage {
    command: 'removeConfiguration';
    data: GradientPreset;
}

/**
 * Message sent from webview to extension to persist state
 */
export interface PersistStateMessage {
    command: 'persistState';
    data: GradientPreset;
}

/**
 * Message sent from webview to extension when paste is complete
 */
export interface PasteDoneMessage {
    command: 'pasteDone';
}

/**
 * Union type of all possible messages from webview
 */
export type WebviewMessage = SaveImageMessage | SaveConfigMessage | RemoveConfigMessage | PersistStateMessage | PasteDoneMessage;

/**
 * Message sent from extension to webview to update configurations
 */
export interface UpdateConfigsMessage {
    command: 'updateConfigurations';
    data: GradientPreset[];
}

/**
 * Shared gradient configuration interface
 */
export interface GradientConfig {
    color1: string;
    color2: string;
    angle: number;
    showMacHeader: boolean;
}

/**
 * Gradient preset configuration
 */
export interface GradientPreset extends GradientConfig {
    label?: string;
    isDefault?: boolean;
}

/**
 * SuperSnap configuration settings
 */
export interface SuperSnapConfig {
    backgroundGradient: string;
    savedPresets: GradientPreset[];
}
