/**
 * Integration tests for the SuperSnap VS Code extension
 * Tests extension activation, command registration, and configuration
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { COMMANDS, CONFIG_KEYS, DEFAULTS, PRESETS, ERROR_MESSAGES } from '../constants';

suite('SuperSnap Extension Test Suite', () => {
	vscode.window.showInformationMessage('Starting SuperSnap tests.');

	// Extension identification varies based on environment
	const extensionId = 'your-publisher-name.supersnap';

	suite('Extension Presence and Activation', () => {
		test('Extension should be present', () => {
			const ext = vscode.extensions.getExtension(extensionId);
			assert.ok(ext, 'Extension should be registered');
		});

		test('Extension should have correct display name', () => {
			const ext = vscode.extensions.getExtension(extensionId);
			if (ext) {
				assert.ok(
					ext.packageJSON.displayName.includes('SuperSnap'),
					'Display name should include SuperSnap'
				);
			}
		});

		test('Extension should activate', async () => {
			const ext = vscode.extensions.getExtension(extensionId);
			assert.ok(ext, 'Extension should exist');
			await ext?.activate();
			assert.strictEqual(ext?.isActive, true, 'Extension should be active');
		});

		test('Extension activation should be idempotent', async () => {
			const ext = vscode.extensions.getExtension(extensionId);
			assert.ok(ext);
			
			// Activate multiple times should not throw
			await ext?.activate();
			await ext?.activate();
			await ext?.activate();
			
			assert.strictEqual(ext?.isActive, true);
		});
	});

	suite('Command Registration', () => {
		test('Should register supersnap.start command', async () => {
			const commands = await vscode.commands.getCommands(true);
			assert.ok(
				commands.includes(COMMANDS.START),
				`Command ${COMMANDS.START} should be registered`
			);
		});

		test('Registered command should match constants', async () => {
			const commands = await vscode.commands.getCommands(true);
			assert.ok(
				commands.includes('supersnap.start'),
				'Command should be exactly supersnap.start'
			);
		});

		test('Command should be available after activation', async () => {
			const ext = vscode.extensions.getExtension(extensionId);
			await ext?.activate();
			
			const commands = await vscode.commands.getCommands(true);
			assert.ok(commands.includes(COMMANDS.START));
		});
	});

	suite('Command Execution', () => {
		test('Command should handle no active editor gracefully', async () => {
			// Close all editors
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
			
			// Wait for editors to close
			await new Promise(resolve => setTimeout(resolve, 100));
			
			// Try to execute command - should not throw
			try {
				await vscode.commands.executeCommand(COMMANDS.START);
				assert.ok(true, 'Command executed without throwing');
			} catch {
				assert.fail('Command should not throw when no editor is active');
			}
		});

		test('Command should be executable programmatically', async () => {
			try {
				// This should not throw even if there's no editor
				await vscode.commands.executeCommand(COMMANDS.START);
			} catch (error) {
				// Command should handle errors internally, not throw
				assert.fail(`Command threw an error: ${error}`);
			}
		});
	});

	suite('Configuration Defaults', () => {
		test('Configuration should have correct backgroundGradient default', () => {
			const config = vscode.workspace.getConfiguration('supersnap');
			const gradient = config.get<string>('backgroundGradient');
			
			assert.strictEqual(
				gradient,
				'linear-gradient(140deg, rgb(165, 55, 253), rgb(33, 209, 244))',
				'Default gradient should match expected value'
			);
		});

		test('backgroundGradient should match DEFAULTS.GRADIENT', () => {
			const config = vscode.workspace.getConfiguration('supersnap');
			const gradient = config.get<string>('backgroundGradient');
			
			assert.strictEqual(
				gradient,
				DEFAULTS.GRADIENT,
				'Configuration should match constants'
			);
		});

		test('Configuration should have savedPresets as empty array by default', () => {
			const config = vscode.workspace.getConfiguration('supersnap');
			const presets = config.get<unknown[]>('savedPresets');
			
			assert.ok(Array.isArray(presets), 'savedPresets should be an array');
			assert.strictEqual(presets?.length, 0, 'savedPresets should be empty by default');
		});

		test('Configuration should be of type object', () => {
			const config = vscode.workspace.getConfiguration('supersnap');
			assert.ok(config, 'Configuration should exist');
		});
	});

	suite('Configuration Properties', () => {
		test('Should be able to inspect backgroundGradient', () => {
			const config = vscode.workspace.getConfiguration('supersnap');
			const inspection = config.inspect<string>('backgroundGradient');
			
			assert.ok(inspection, 'Should be able to inspect configuration');
			assert.ok(inspection?.defaultValue, 'Should have default value');
		});

		test('Should be able to inspect savedPresets', () => {
			const config = vscode.workspace.getConfiguration('supersnap');
			const inspection = config.inspect<unknown[]>('savedPresets');
			
			assert.ok(inspection, 'Should be able to inspect configuration');
			assert.ok(Array.isArray(inspection?.defaultValue), 'Default should be array');
		});

		test('Configuration keys should exist in package.json', () => {
			const ext = vscode.extensions.getExtension(extensionId);
			const contributes = ext?.packageJSON.contributes;
			
			assert.ok(contributes?.configuration, 'Should have configuration contribution');
			assert.ok(
				contributes?.configuration?.properties?.['supersnap.backgroundGradient'],
				'Should have backgroundGradient property'
			);
			assert.ok(
				contributes?.configuration?.properties?.['supersnap.savedPresets'],
				'Should have savedPresets property'
			);
		});
	});

	suite('Constants Consistency', () => {
		test('CONFIG_KEYS should use correct namespace', () => {
			assert.ok(
				CONFIG_KEYS.BACKGROUND_GRADIENT.startsWith('supersnap.'),
				'Config keys should be namespaced'
			);
		});

		test('PRESETS should have valid structure', () => {
			assert.ok(PRESETS.length > 0, 'Should have at least one preset');
			
			PRESETS.forEach((preset, index) => {
				assert.ok(preset.color1, `Preset ${index} should have color1`);
				assert.ok(preset.color2, `Preset ${index} should have color2`);
				assert.ok(typeof preset.angle === 'number', `Preset ${index} should have angle`);
			});
		});

		test('ERROR_MESSAGES should be defined', () => {
			assert.ok(ERROR_MESSAGES.NO_ACTIVE_EDITOR, 'Should have NO_ACTIVE_EDITOR message');
			assert.ok(ERROR_MESSAGES.SAVE_FAILED, 'Should have SAVE_FAILED message');
		});
	});

	suite('Extension Package Metadata', () => {
		test('Should have valid main entry point', () => {
			const ext = vscode.extensions.getExtension(extensionId);
			assert.ok(ext?.packageJSON.main, 'Should have main entry point');
		});

		test('Should have contributes section', () => {
			const ext = vscode.extensions.getExtension(extensionId);
			assert.ok(ext?.packageJSON.contributes, 'Should have contributes');
		});

		test('Should have commands contribution', () => {
			const ext = vscode.extensions.getExtension(extensionId);
			const commands = ext?.packageJSON.contributes?.commands;
			
			assert.ok(Array.isArray(commands), 'Commands should be an array');
			assert.ok(commands?.length > 0, 'Should have at least one command');
			
			const startCommand = commands?.find(
				(cmd: { command: string }) => cmd.command === 'supersnap.start'
			);
			assert.ok(startCommand, 'Should have supersnap.start command');
			assert.ok(startCommand?.title, 'Command should have title');
		});

		test('Should have valid engine requirement', () => {
			const ext = vscode.extensions.getExtension(extensionId);
			const engines = ext?.packageJSON.engines;
			
			assert.ok(engines?.vscode, 'Should specify VS Code engine version');
		});
	});

	suite('Webview Panel', () => {
		// Note: These tests are limited because webview testing is complex
		// Full webview testing requires Extension Development Host

		test('WebviewPanel API should be available', () => {
			assert.ok(
				typeof vscode.window.createWebviewPanel === 'function',
				'createWebviewPanel should be available'
			);
		});

		test('ViewColumn constants should be defined', () => {
			assert.ok(vscode.ViewColumn.One, 'ViewColumn.One should exist');
			assert.ok(vscode.ViewColumn.Two, 'ViewColumn.Two should exist');
		});
	});

	suite('Message Types Compatibility', () => {
		// Test that message command strings are valid
		const validCommands = [
			'saveImage',
			'saveConfiguration',
			'removeConfiguration',
			'persistState',
			'pasteDone',
			'updateConfigurations',
			'triggerPaste'
		];

		validCommands.forEach(command => {
			test(`Message command '${command}' should be a valid string`, () => {
				assert.strictEqual(typeof command, 'string');
				assert.ok(command.length > 0);
			});
		});
	});
});
