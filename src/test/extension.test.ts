import * as assert from 'assert';
import * as vscode from 'vscode';

suite('SuperSnap Extension Test Suite', () => {
	vscode.window.showInformationMessage('Starting SuperSnap tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('your-publisher-name.supersnap'));
	});

	test('Extension should activate', async () => {
		const ext = vscode.extensions.getExtension('your-publisher-name.supersnap');
		assert.ok(ext);
		await ext?.activate();
		assert.strictEqual(ext?.isActive, true);
	});

	test('Should register supersnap.start command', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('supersnap.start'));
	});

	test('Command should handle no active editor gracefully', async () => {
		// Close all editors
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		
		// Try to execute command - should not throw
		try {
			await vscode.commands.executeCommand('supersnap.start');
			assert.ok(true, 'Command executed without throwing');
		} catch {
			assert.fail('Command should not throw when no editor is active');
		}
	});

	test('Configuration should have correct defaults', () => {
		const config = vscode.workspace.getConfiguration('supersnap');
		const gradient = config.get('backgroundGradient');
		assert.strictEqual(
			gradient,
			'linear-gradient(140deg, rgb(165, 55, 253), rgb(33, 209, 244))'
		);
	});

	test('Configuration should have savedPresets array', () => {
		const config = vscode.workspace.getConfiguration('supersnap');
		const presets = config.get('savedPresets');
		assert.ok(Array.isArray(presets));
	});
});
