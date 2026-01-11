import * as vscode from 'vscode';
import { GradientPreset } from '../types/messages';
import { webviewScript } from './webviewScript';

/**
 * Generates a random nonce for Content Security Policy
 * @returns A random nonce string
 */
export function getNonce(): string {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

import { styles } from './webviewStyles';

/**
 * JavaScript code for the webview
 */
const script = `(${webviewScript.toString()})();`;

/**
 * Generates the HTML content for the SuperSnap webview
 * @param webview - The webview instance
 * @param savedPresets - Array of user-saved presets
 * @param defaultPresets - Array of default system presets
 * @param lastSelection - The last selected gradient (for persistence)
 * @returns HTML content as string
 */
export function getWebviewContent(
    webview: vscode.Webview, 
    savedPresets: GradientPreset[] = [], 
    defaultPresets: GradientPreset[] = [],
    lastSelection?: GradientPreset
): string {
    const nonce = getNonce();

    // Determine initial state
    const initialConfig = lastSelection || defaultPresets[0] || { color1: '#f8ad45', color2: '#ed5f32', angle: 140, showMacHeader: true };
    const allPresets = [...defaultPresets, ...savedPresets];

    // Content Security Policy
    const csp = [
        `default-src 'none'`,
        `style-src 'unsafe-inline'`, // Required for dynamic gradient styles
        `script-src 'nonce-${nonce}' https://cdnjs.cloudflare.com`,
        `img-src ${webview.cspSource} data:`,
        `connect-src https://cdnjs.cloudflare.com`,
    ].join('; ');

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="${csp}">
        <title>SuperSnap</title>
        <script nonce="${nonce}">
            window.initialPresets = ${JSON.stringify(allPresets)};
        </script>
        <script nonce="${nonce}" src="https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js"></script>
        <style nonce="${nonce}">
            ${styles}
        </style>
    </head>
    <body>
        <div id="controls">
            <div class="control-group">
                <h3>Gradient Colors</h3>
                <div class="input-row">
                    <label>Start Color</label>
                    <input type="color" id="color1" value="${initialConfig.color1}" aria-label="Start gradient color">
                </div>
                <div class="input-row">
                    <label>End Color</label>
                    <input type="color" id="color2" value="${initialConfig.color2}" aria-label="End gradient color">
                </div>
            </div>

            <div class="control-group">
                <h3>Rotation</h3>
                <div class="input-row">
                    <input type="range" id="angle" min="0" max="360" value="${initialConfig.angle}" aria-label="Gradient rotation angle">
                    <span class="value-display" id="angle-val">${initialConfig.angle}°</span>
                </div>
            </div>

            <div class="control-group">
                <div class="input-row">
                    <label>Mac-like Header</label>
                    <label class="switch">
                        <input type="checkbox" id="mac-header-toggle" ${initialConfig.showMacHeader ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <button id="save-config-btn" style="padding: 8px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 10px;">Save Configuration</button>
            
            <div class="control-group">
                <h3>Presets</h3>
                <div id="saved-presets" class="preset-grid">
                    <!-- Presets will be rendered here -->
                </div>
            </div>
        </div>

        <div id="preview-area">
            <div id="snap-container" style="background: linear-gradient(${initialConfig.angle}deg, ${initialConfig.color1}, ${initialConfig.color2});">
                <div class="window">
                    <div class="title-bar" style="display: ${initialConfig.showMacHeader ? 'flex' : 'none'};">
                        <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                    </div>
                    <div id="code-content" contenteditable="true"></div>
                </div>
            </div>
            <button id="snap-btn">📸 Export Snippet</button>
        </div>

        <dialog id="confirm-dialog">
            <h4 style="margin-top: 0;">Confirm Removal</h4>
            <p>Are you sure you want to permanently remove this configuration?</p>
            <div class="modal-buttons">
                <button id="cancel-remove" class="modal-btn btn-cancel">Cancel</button>
                <button id="confirm-remove" class="modal-btn btn-confirm">Confirm</button>
            </div>
        </dialog>

        <script nonce="${nonce}">
            ${script}
        </script>
    </body>
    </html>`;
}
