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

/**
 * CSS styles for the webview
 */
const styles = `
:root {
    --panel-bg: #252526;
    --text-color: #cccccc;
    --accent: #007acc;
}

body { 
    background-color: #1e1e1e; 
    display: flex; 
    flex-direction: row; 
    height: 100vh; 
    margin: 0; 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--text-color);
}

/* --- Sidebar Controls --- */
#controls {
    width: 280px;
    background: var(--panel-bg);
    border-right: 1px solid #333;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    z-index: 10;
}

h3 { 
    margin: 0 0 8px 0; 
    font-size: 11px; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    color: #888; 
}

.control-group { 
    display: flex; 
    flex-direction: column; 
    gap: 12px; 
}

.input-row { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    justify-content: space-between; 
}

label { 
    font-size: 13px; 
    color: #bbb; 
}

input[type="color"] {
    appearance: none;
    -webkit-appearance: none;
    border: none;
    width: 30px;
    height: 30px;
    cursor: pointer;
    background: none;
    padding: 0;
}

input[type="color"]::-webkit-color-swatch { 
    border-radius: 4px; 
    border: 1px solid #555; 
}

input[type="range"] { 
    flex-grow: 1; 
    cursor: pointer; 
}

.value-display { 
    font-size: 11px; 
    font-family: monospace; 
    color: var(--accent); 
    width: 30px; 
    text-align: right; 
}

/* --- Preview Area --- */
#preview-area {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: radial-gradient(#333 1px, transparent 1px);
    background-size: 20px 20px;
}

#snap-container {
    padding: 3rem;
    background: linear-gradient(140deg, #f8ad45, #ed5f32);
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.window {
    background-color: #1e1e1e; 
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    overflow: hidden;
    min-width: 400px;
}

.title-bar { 
    padding: 12px; 
    display: flex; 
    gap: 8px; 
    background: rgba(255,255,255,0.05); 
}

.dot { 
    width: 12px; 
    height: 12px; 
    border-radius: 50%; 
}

.red { background: #ff5f56; }
.yellow { background: #ffbd2e; }
.green { background: #27c93f; }

#code-content { 
    padding: 20px; 
    outline: none; 
    min-height: 50px; 
}

#code-content pre, 
#code-content div { 
    margin: 0 !important; 
    padding: 0 !important; 
    background-color: transparent !important; 
    border: none !important; 
}

#snap-btn { 
    margin-top: 40px; 
    padding: 12px 32px; 
    background: var(--accent); 
    color: white; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer; 
    font-weight: bold;
    box-shadow: 0 4px 14px rgba(0,122,204,0.4);
}

#snap-btn:hover {
    background: #005a9e;
}

/* --- Toggle Switch --- */
.switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
}

.switch input { 
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    transition: .4s;
    border-radius: 20px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--accent);
}

input:checked + .slider:before {
    transform: translateX(14px);
}

.preset-button {
    flex: 1;
    height: 24px;
    border: 1px solid #555;
    cursor: pointer;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.preset-button .mini-header {
    height: 6px;
    display: flex;
    gap: 2px;
    padding: 2px 4px 1px 4px;
    background: rgba(255,255,255,0.35);
}

.preset-button .mini-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255,255,255,0.7);
    margin: 0;
}

.preset-button:hover {
    border-color: var(--accent);
}

.preset-button.active {
    outline: 2px solid white;
    outline-offset: 2px;
    opacity: 0.8;
    cursor: default;
}

.preset-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.preset-wrapper {
    position: relative;
}

.remove-btn {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 16px;
    height: 16px;
    opacity: 0;
    transition: opacity 0.2s;
    background: #ff5f56;
    color: white;
    border-radius: 50%;
    padding: 0;
    border: none;
    cursor: pointer;
    font-size: 10px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.preset-wrapper:hover .remove-btn {
    opacity: 1;
}

dialog {
    background: #252526;
    color: #cccccc;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

dialog::backdrop {
    background: rgba(0,0,0,0.5);
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-btn {
    padding: 6px 12px;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    font-size: 12px;
}

.btn-cancel {
    background: #3c3c3c;
    color: #ccc;
    border: 1px solid #555;
}

.btn-confirm {
    background: #ff5f56;
    color: white;
}
`;

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
                    <input type="color" id="color1" value="${initialConfig.color1}">
                </div>
                <div class="input-row">
                    <label>End Color</label>
                    <input type="color" id="color2" value="${initialConfig.color2}">
                </div>
            </div>

            <div class="control-group">
                <h3>Rotation</h3>
                <div class="input-row">
                    <input type="range" id="angle" min="0" max="360" value="${initialConfig.angle}">
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
