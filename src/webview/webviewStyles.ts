/**
 * CSS styles for the webview
 */
export const styles = `
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

/* Ensure the custom toggle switch has a visible focus indicator */
.switch input:focus-visible + .slider {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
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
