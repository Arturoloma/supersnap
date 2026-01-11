/**
 * Unit tests for types/messages.ts
 * Tests the structure and type definitions for webview messaging
 */

import * as assert from 'assert';
import type { 
    SaveImageMessage, 
    SaveConfigMessage, 
    RemoveConfigMessage, 
    PersistStateMessage, 
    PasteDoneMessage,
    WebviewMessage, 
    UpdateConfigsMessage, 
    GradientConfig, 
    GradientPreset, 
    SuperSnapConfig 
} from '../types/messages';

suite('Message Types Test Suite', () => {

    suite('GradientConfig Interface', () => {
        test('should create valid GradientConfig object', () => {
            const config: GradientConfig = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };

            assert.strictEqual(config.color1, '#ff0000');
            assert.strictEqual(config.color2, '#00ff00');
            assert.strictEqual(config.angle, 90);
            assert.strictEqual(config.showMacHeader, true);
        });

        test('should allow any string for colors', () => {
            const config: GradientConfig = {
                color1: 'rgb(255, 0, 0)',
                color2: 'hsl(120, 100%, 50%)',
                angle: 45,
                showMacHeader: false
            };

            assert.ok(config.color1);
            assert.ok(config.color2);
        });

        test('should accept zero angle', () => {
            const config: GradientConfig = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 0,
                showMacHeader: true
            };

            assert.strictEqual(config.angle, 0);
        });

        test('should accept 360 degree angle', () => {
            const config: GradientConfig = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 360,
                showMacHeader: true
            };

            assert.strictEqual(config.angle, 360);
        });
    });

    suite('GradientPreset Interface', () => {
        test('should extend GradientConfig with optional properties', () => {
            const preset: GradientPreset = {
                color1: '#a537fd',
                color2: '#21d1f4',
                angle: 140,
                showMacHeader: true,
                label: 'Purple to blue',
                isDefault: true
            };

            assert.strictEqual(preset.label, 'Purple to blue');
            assert.strictEqual(preset.isDefault, true);
        });

        test('should work without optional properties', () => {
            const preset: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 45,
                showMacHeader: false
            };

            assert.strictEqual(preset.label, undefined);
            assert.strictEqual(preset.isDefault, undefined);
        });

        test('should allow empty string label', () => {
            const preset: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 45,
                showMacHeader: true,
                label: ''
            };

            assert.strictEqual(preset.label, '');
        });

        test('should allow isDefault to be false', () => {
            const preset: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 45,
                showMacHeader: true,
                isDefault: false
            };

            assert.strictEqual(preset.isDefault, false);
        });
    });

    suite('SaveImageMessage', () => {
        test('should have correct structure', () => {
            const message: SaveImageMessage = {
                command: 'saveImage',
                data: 'data:image/png;base64,iVBORw0KGgo='
            };

            assert.strictEqual(message.command, 'saveImage');
            assert.ok(message.data.startsWith('data:image/'));
        });

        test('command must be saveImage literal', () => {
            const message: SaveImageMessage = {
                command: 'saveImage',
                data: 'test-data'
            };

            assert.strictEqual(message.command, 'saveImage');
        });
    });

    suite('SaveConfigMessage', () => {
        test('should have correct structure', () => {
            const preset: GradientPreset = {
                color1: '#ff0000',
                color2: '#0000ff',
                angle: 90,
                showMacHeader: true,
                label: 'Test Preset'
            };

            const message: SaveConfigMessage = {
                command: 'saveConfiguration',
                data: preset
            };

            assert.strictEqual(message.command, 'saveConfiguration');
            assert.deepStrictEqual(message.data, preset);
        });
    });

    suite('RemoveConfigMessage', () => {
        test('should have correct structure', () => {
            const preset: GradientPreset = {
                color1: '#ff0000',
                color2: '#0000ff',
                angle: 90,
                showMacHeader: true
            };

            const message: RemoveConfigMessage = {
                command: 'removeConfiguration',
                data: preset
            };

            assert.strictEqual(message.command, 'removeConfiguration');
            assert.deepStrictEqual(message.data, preset);
        });
    });

    suite('PersistStateMessage', () => {
        test('should have correct structure', () => {
            const state: GradientPreset = {
                color1: '#123456',
                color2: '#654321',
                angle: 180,
                showMacHeader: false
            };

            const message: PersistStateMessage = {
                command: 'persistState',
                data: state
            };

            assert.strictEqual(message.command, 'persistState');
            assert.deepStrictEqual(message.data, state);
        });
    });

    suite('PasteDoneMessage', () => {
        test('should have correct structure', () => {
            const message: PasteDoneMessage = {
                command: 'pasteDone'
            };

            assert.strictEqual(message.command, 'pasteDone');
        });

        test('should not have data property', () => {
            const message: PasteDoneMessage = {
                command: 'pasteDone'
            };

            assert.ok(!('data' in message));
        });
    });

    suite('WebviewMessage Union Type', () => {
        test('should accept SaveImageMessage', () => {
            const message: WebviewMessage = {
                command: 'saveImage',
                data: 'base64data'
            };

            assert.strictEqual(message.command, 'saveImage');
        });

        test('should accept SaveConfigMessage', () => {
            const message: WebviewMessage = {
                command: 'saveConfiguration',
                data: {
                    color1: '#000',
                    color2: '#fff',
                    angle: 0,
                    showMacHeader: true
                }
            };

            assert.strictEqual(message.command, 'saveConfiguration');
        });

        test('should accept RemoveConfigMessage', () => {
            const message: WebviewMessage = {
                command: 'removeConfiguration',
                data: {
                    color1: '#000',
                    color2: '#fff',
                    angle: 0,
                    showMacHeader: true
                }
            };

            assert.strictEqual(message.command, 'removeConfiguration');
        });

        test('should accept PersistStateMessage', () => {
            const message: WebviewMessage = {
                command: 'persistState',
                data: {
                    color1: '#000',
                    color2: '#fff',
                    angle: 0,
                    showMacHeader: true
                }
            };

            assert.strictEqual(message.command, 'persistState');
        });

        test('should accept PasteDoneMessage', () => {
            const message: WebviewMessage = {
                command: 'pasteDone'
            };

            assert.strictEqual(message.command, 'pasteDone');
        });
    });

    suite('UpdateConfigsMessage', () => {
        test('should have correct structure', () => {
            const presets: GradientPreset[] = [
                { color1: '#000', color2: '#fff', angle: 0, showMacHeader: true },
                { color1: '#f00', color2: '#00f', angle: 90, showMacHeader: false, label: 'Test' }
            ];

            const message: UpdateConfigsMessage = {
                command: 'updateConfigurations',
                data: presets
            };

            assert.strictEqual(message.command, 'updateConfigurations');
            assert.strictEqual(message.data.length, 2);
        });

        test('should accept empty presets array', () => {
            const message: UpdateConfigsMessage = {
                command: 'updateConfigurations',
                data: []
            };

            assert.strictEqual(message.data.length, 0);
        });
    });

    suite('SuperSnapConfig Interface', () => {
        test('should have correct structure', () => {
            const config: SuperSnapConfig = {
                backgroundGradient: 'linear-gradient(140deg, #a537fd, #21d1f4)',
                savedPresets: []
            };

            assert.ok(config.backgroundGradient);
            assert.ok(Array.isArray(config.savedPresets));
        });

        test('should accept presets with all properties', () => {
            const config: SuperSnapConfig = {
                backgroundGradient: 'linear-gradient(90deg, #f00, #00f)',
                savedPresets: [
                    {
                        color1: '#ff0000',
                        color2: '#0000ff',
                        angle: 90,
                        showMacHeader: true,
                        label: 'Red to Blue',
                        isDefault: false
                    }
                ]
            };

            assert.strictEqual(config.savedPresets.length, 1);
            assert.strictEqual(config.savedPresets[0].label, 'Red to Blue');
        });
    });
});
