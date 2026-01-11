import * as vscode from 'vscode';
import { getWebviewContent } from './webview/webviewContent';
import { WebviewMessage, GradientPreset } from './types/messages';
import { COMMANDS, DEFAULTS, ERROR_MESSAGES, FILE_FILTERS, WEBVIEW, CONFIG_KEYS, PRESETS } from './constants';

/**
 * Activates the SuperSnap extension
 * @param context - Extension context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext): void {
    const disposable = vscode.commands.registerCommand(COMMANDS.START, async () => {
        await handleSuperSnapCommand(context);
    });
    
    context.subscriptions.push(disposable);
}

/**
 * Handles the SuperSnap command execution
 * @param context - Extension context
 */
async function handleSuperSnapCommand(context: vscode.ExtensionContext): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showErrorMessage(ERROR_MESSAGES.NO_ACTIVE_EDITOR);
        return;
    }

    try {
        // Copy selected code to clipboard
        await vscode.commands.executeCommand('editor.action.clipboardCopyAction');

        // Create and configure webview panel
        const panel = createWebviewPanel(context);
        
        // Set up message handling
        setupMessageHandler(panel, context);

        // Trigger initial paste
        panel.webview.postMessage({ command: 'triggerPaste' });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`SuperSnap: ${errorMessage}`);
    }
}

/**
 * Creates and configures the webview panel
 * @param context - Extension context
 * @returns The created webview panel
 */
function createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
        WEBVIEW.VIEW_TYPE,
        WEBVIEW.TITLE,
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [context.extensionUri]
        }
    );

    // Load saved presets
    const savedPresets = context.globalState.get<GradientPreset[]>(CONFIG_KEYS.SAVED_PRESETS) || [];
    const lastSelection = context.globalState.get<GradientPreset>(CONFIG_KEYS.LAST_SELECTION);
    panel.webview.html = getWebviewContent(panel.webview, savedPresets, PRESETS, lastSelection);
    
    return panel;
}

/**
 * Sets up message handler for webview communication
 * @param panel - The webview panel
 * @param context - Extension context
 */
function setupMessageHandler(panel: vscode.WebviewPanel, context: vscode.ExtensionContext): void {
    const messageDisposable = panel.webview.onDidReceiveMessage(
        async (message: WebviewMessage) => {
            await handleWebviewMessage(message, panel, context);
        }
    );
    
    // Clean up when panel is disposed
    panel.onDidDispose(() => {
        messageDisposable.dispose();
    });
}

/**
 * Handles messages received from the webview
 * @param message - Message from webview
 * @param panel - The webview panel
 * @param context - Extension context
 */
async function handleWebviewMessage(message: WebviewMessage, panel: vscode.WebviewPanel, context: vscode.ExtensionContext): Promise<void> {
    switch (message.command) {
        case 'saveImage':
            await handleSaveImage(message.data);
            break;
        case 'saveConfiguration':
            await handleSaveConfiguration(message.data, panel, context);
            break;
        case 'removeConfiguration':
            await handleRemoveConfiguration(message.data, panel, context);
            break;
        case 'persistState':
            await handlePersistState(message.data, context);
            break;
        default:
            console.warn('Unknown message command:', message);
    }
}

/**
 * Checks if two presets are equal
 * @param a - First preset
 * @param b - Second preset
 * @returns True if presets are equal
 */
function presetsEqual(a: GradientPreset, b: GradientPreset): boolean {
    return a.color1 === b.color1 && 
           a.color2 === b.color2 && 
           a.angle === b.angle && 
           a.showMacHeader === b.showMacHeader;
}

/**
 * Handles saving the configuration
 * @param preset - The preset configuration to save
 * @param panel - The webview panel
 * @param context - Extension context
 */
async function handleSaveConfiguration(preset: GradientPreset, panel: vscode.WebviewPanel, context: vscode.ExtensionContext): Promise<void> {
    const savedPresets = context.globalState.get<GradientPreset[]>(CONFIG_KEYS.SAVED_PRESETS) || [];
    
    // Check for duplicates
    const isDuplicate = savedPresets.some(p => presetsEqual(p, preset));

    if (isDuplicate) {
        vscode.window.showInformationMessage('SuperSnap: This configuration is already saved!');
        return;
    }

    const newPresets = [...savedPresets, preset];
    
    await context.globalState.update(CONFIG_KEYS.SAVED_PRESETS, newPresets);
    
    // Update webview
    panel.webview.postMessage({ command: 'updateConfigurations', data: [...PRESETS, ...newPresets] });
    
    vscode.window.showInformationMessage('SuperSnap: Preset saved!');
}

/**
 * Handles removing a configuration
 * @param preset - The preset configuration to remove
 * @param panel - The webview panel
 * @param context - Extension context
 */
async function handleRemoveConfiguration(preset: GradientPreset, panel: vscode.WebviewPanel, context: vscode.ExtensionContext): Promise<void> {
    const savedPresets = context.globalState.get<GradientPreset[]>(CONFIG_KEYS.SAVED_PRESETS) || [];
    
    // Filter out the preset to be removed
    const newPresets = savedPresets.filter(p => !presetsEqual(p, preset));
    
    await context.globalState.update(CONFIG_KEYS.SAVED_PRESETS, newPresets);
    
    // Update webview
    panel.webview.postMessage({ command: 'updateConfigurations', data: [...PRESETS, ...newPresets] });
    
    vscode.window.showInformationMessage('SuperSnap: Preset removed!');
}

/**
 * Handles persisting the state (debounced auto-save)
 * @param state - The gradient state to persist
 * @param context - Extension context
 */
async function handlePersistState(state: GradientPreset, context: vscode.ExtensionContext): Promise<void> {
    await context.globalState.update(CONFIG_KEYS.LAST_SELECTION, state);
    // Silent update, no notification needed
}

/**
 * Handles saving the generated image
 * @param base64Data - Base64 encoded image data with data URI prefix
 */
async function handleSaveImage(base64Data: string): Promise<void> {
    try {
        // Validate input
        if (!base64Data || typeof base64Data !== 'string') {
            throw new Error('Invalid image data');
        }

        // Remove data URI prefix
        const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(data, 'base64');

        // Show save dialog
        const uri = await vscode.window.showSaveDialog({
            filters: FILE_FILTERS,
            defaultUri: vscode.Uri.file(DEFAULTS.FILE_NAME)
        });

        if (uri) {
            await vscode.workspace.fs.writeFile(uri, buffer);
            vscode.window.showInformationMessage(`SuperSnap: Image saved to ${uri.fsPath}`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`${ERROR_MESSAGES.SAVE_FAILED}: ${errorMessage}`);
    }
}

/**
 * Deactivates the extension and cleans up resources
 */
export function deactivate(): void {
    // Cleanup code if needed
}