/**
 * Unit tests for constants.ts
 * Tests the integrity and correctness of all constant values
 */

import * as assert from 'assert';
import { 
    COMMANDS, 
    CONFIG_KEYS, 
    DEFAULTS, 
    PRESETS, 
    WEBVIEW, 
    FILE_FILTERS, 
    ERROR_MESSAGES 
} from '../constants';

suite('Constants Test Suite', () => {

    suite('COMMANDS', () => {
        test('should have correct START command', () => {
            assert.strictEqual(COMMANDS.START, 'supersnap.start');
        });

        test('START command should follow naming convention', () => {
            assert.ok(COMMANDS.START.startsWith('supersnap.'), 'Command should be namespaced with supersnap.');
        });
    });

    suite('CONFIG_KEYS', () => {
        test('should have BACKGROUND_GRADIENT key', () => {
            assert.strictEqual(CONFIG_KEYS.BACKGROUND_GRADIENT, 'supersnap.backgroundGradient');
        });

        test('should have SAVED_PRESETS key', () => {
            assert.strictEqual(CONFIG_KEYS.SAVED_PRESETS, 'supersnap.savedPresets');
        });

        test('should have LAST_SELECTION key', () => {
            assert.strictEqual(CONFIG_KEYS.LAST_SELECTION, 'supersnap.lastSelection');
        });

        test('should have SHOW_MAC_HEADER key', () => {
            assert.strictEqual(CONFIG_KEYS.SHOW_MAC_HEADER, 'supersnap.showMacHeader');
        });

        test('all config keys should be namespaced correctly', () => {
            const keys = Object.values(CONFIG_KEYS);
            keys.forEach(key => {
                assert.ok(key.startsWith('supersnap.'), `Config key "${key}" should start with "supersnap."`);
            });
        });
    });

    suite('DEFAULTS', () => {
        test('should have correct ANGLE default', () => {
            assert.strictEqual(DEFAULTS.ANGLE, 140);
        });

        test('should have properly formatted GRADIENT default', () => {
            assert.ok(DEFAULTS.GRADIENT.startsWith('linear-gradient('), 'Gradient should be a linear-gradient');
            assert.ok(DEFAULTS.GRADIENT.includes('140deg'), 'Gradient should use default angle');
            assert.ok(DEFAULTS.GRADIENT.includes('rgb(165, 55, 253)'), 'Gradient should include first color');
            assert.ok(DEFAULTS.GRADIENT.includes('rgb(33, 209, 244)'), 'Gradient should include second color');
        });

        test('should have correct FILE_NAME default', () => {
            assert.strictEqual(DEFAULTS.FILE_NAME, 'code-snapshot.png');
            assert.ok(DEFAULTS.FILE_NAME.endsWith('.png'), 'Default file name should be PNG');
        });

        test('should have positive PASTE_DELAY_MS value', () => {
            assert.strictEqual(DEFAULTS.PASTE_DELAY_MS, 150);
            assert.ok(DEFAULTS.PASTE_DELAY_MS > 0, 'Paste delay should be positive');
        });

        test('should have SHOW_MAC_HEADER default as true', () => {
            assert.strictEqual(DEFAULTS.SHOW_MAC_HEADER, true);
        });
    });

    suite('PRESETS', () => {
        test('should have at least 3 default presets', () => {
            assert.ok(PRESETS.length >= 3, 'Should have at least 3 presets');
        });

        test('all presets should have required properties', () => {
            PRESETS.forEach((preset, index) => {
                assert.ok(preset.color1, `Preset ${index} should have color1`);
                assert.ok(preset.color2, `Preset ${index} should have color2`);
                assert.ok(typeof preset.angle === 'number', `Preset ${index} should have numeric angle`);
                assert.ok(preset.label, `Preset ${index} should have a label`);
                assert.strictEqual(typeof preset.showMacHeader, 'boolean', `Preset ${index} should have boolean showMacHeader`);
                assert.strictEqual(preset.isDefault, true, `Preset ${index} should be marked as default`);
            });
        });

        test('first preset should match default gradient colors', () => {
            const firstPreset = PRESETS[0];
            assert.strictEqual(firstPreset.color1, '#a537fd');
            assert.strictEqual(firstPreset.color2, '#21d1f4');
            assert.strictEqual(firstPreset.angle, 140);
        });

        test('preset colors should be valid hex colors', () => {
            const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
            PRESETS.forEach((preset, index) => {
                assert.ok(hexColorRegex.test(preset.color1), `Preset ${index} color1 should be valid hex`);
                assert.ok(hexColorRegex.test(preset.color2), `Preset ${index} color2 should be valid hex`);
            });
        });

        test('preset angles should be between 0 and 360', () => {
            PRESETS.forEach((preset, index) => {
                assert.ok(preset.angle >= 0 && preset.angle <= 360, `Preset ${index} angle should be between 0 and 360`);
            });
        });
    });

    suite('WEBVIEW', () => {
        test('should have correct VIEW_TYPE', () => {
            assert.strictEqual(WEBVIEW.VIEW_TYPE, 'supersnap');
        });

        test('should have correct TITLE', () => {
            assert.strictEqual(WEBVIEW.TITLE, 'SuperSnap');
        });
    });

    suite('FILE_FILTERS', () => {
        test('should have Images filter', () => {
            assert.ok(FILE_FILTERS.Images, 'Should have Images filter');
        });

        test('Images filter should include png extension', () => {
            assert.ok(FILE_FILTERS.Images.includes('png'), 'Images filter should include png');
        });

        test('FILE_FILTERS should be properly structured for VS Code API', () => {
            Object.entries(FILE_FILTERS).forEach(([name, extensions]) => {
                assert.ok(typeof name === 'string', 'Filter name should be string');
                assert.ok(Array.isArray(extensions), 'Extensions should be an array');
                extensions.forEach(ext => {
                    assert.ok(typeof ext === 'string', 'Extension should be string');
                    assert.ok(!ext.startsWith('.'), 'Extension should not start with dot');
                });
            });
        });
    });

    suite('ERROR_MESSAGES', () => {
        test('should have NO_ACTIVE_EDITOR message', () => {
            assert.strictEqual(ERROR_MESSAGES.NO_ACTIVE_EDITOR, 'SuperSnap: No active editor found!');
        });

        test('should have SAVE_FAILED message', () => {
            assert.strictEqual(ERROR_MESSAGES.SAVE_FAILED, 'SuperSnap: Failed to save image');
        });

        test('all error messages should be prefixed with SuperSnap', () => {
            Object.values(ERROR_MESSAGES).forEach(message => {
                assert.ok(message.startsWith('SuperSnap:'), `Error message "${message}" should start with "SuperSnap:"`);
            });
        });
    });
});
