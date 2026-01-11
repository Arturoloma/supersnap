/**
 * Unit tests for utility functions and helper logic
 * Tests pure functions that can be extracted and tested in isolation
 */

import * as assert from 'assert';
import type { GradientPreset } from '../types/messages';

/**
 * Re-implementation of presetsEqual function for testing
 * This is extracted from extension.ts for unit testing purposes
 */
function presetsEqual(a: GradientPreset, b: GradientPreset): boolean {
    return a.color1 === b.color1 && 
           a.color2 === b.color2 && 
           a.angle === b.angle && 
           a.showMacHeader === b.showMacHeader;
}

/**
 * Helper to generate a gradient CSS string
 */
function generateGradientStyle(angle: number, color1: string, color2: string): string {
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

/**
 * Helper to validate hex color format
 */
function isValidHexColor(color: string): boolean {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Helper to validate angle range
 */
function isValidAngle(angle: number): boolean {
    return typeof angle === 'number' && angle >= 0 && angle <= 360;
}

/**
 * Helper to clean base64 data URI prefix
 */
function cleanBase64Prefix(data: string): string {
    return data.replace(/^data:image\/\w+;base64,/, '');
}

suite('Utility Functions Test Suite', () => {

    suite('presetsEqual()', () => {
        test('should return true for identical presets', () => {
            const presetA: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            const presetB: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), true);
        });

        test('should return false when color1 differs', () => {
            const presetA: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            const presetB: GradientPreset = {
                color1: '#ff0001',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), false);
        });

        test('should return false when color2 differs', () => {
            const presetA: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            const presetB: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff01',
                angle: 90,
                showMacHeader: true
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), false);
        });

        test('should return false when angle differs', () => {
            const presetA: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            const presetB: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 91,
                showMacHeader: true
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), false);
        });

        test('should return false when showMacHeader differs', () => {
            const presetA: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            const presetB: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: false
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), false);
        });

        test('should ignore optional properties like label', () => {
            const presetA: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true,
                label: 'Preset A'
            };
            const presetB: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true,
                label: 'Preset B'
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), true);
        });

        test('should ignore isDefault property', () => {
            const presetA: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true,
                isDefault: true
            };
            const presetB: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true,
                isDefault: false
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), true);
        });

        test('should handle edge case with 0 angle', () => {
            const presetA: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 0,
                showMacHeader: true
            };
            const presetB: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 0,
                showMacHeader: true
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), true);
        });

        test('should handle edge case with 360 angle', () => {
            const presetA: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 360,
                showMacHeader: false
            };
            const presetB: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 360,
                showMacHeader: false
            };
            
            assert.strictEqual(presetsEqual(presetA, presetB), true);
        });
    });

    suite('generateGradientStyle()', () => {
        test('should generate valid CSS gradient', () => {
            const result = generateGradientStyle(140, '#a537fd', '#21d1f4');
            assert.strictEqual(result, 'linear-gradient(140deg, #a537fd, #21d1f4)');
        });

        test('should handle 0 degree angle', () => {
            const result = generateGradientStyle(0, '#000000', '#ffffff');
            assert.strictEqual(result, 'linear-gradient(0deg, #000000, #ffffff)');
        });

        test('should handle 360 degree angle', () => {
            const result = generateGradientStyle(360, '#ff0000', '#0000ff');
            assert.strictEqual(result, 'linear-gradient(360deg, #ff0000, #0000ff)');
        });

        test('should work with RGB color format', () => {
            const result = generateGradientStyle(90, 'rgb(255, 0, 0)', 'rgb(0, 0, 255)');
            assert.ok(result.includes('rgb(255, 0, 0)'));
            assert.ok(result.includes('rgb(0, 0, 255)'));
        });

        test('should preserve color case', () => {
            const result = generateGradientStyle(45, '#AABBCC', '#ddeeff');
            assert.ok(result.includes('#AABBCC'));
            assert.ok(result.includes('#ddeeff'));
        });
    });

    suite('isValidHexColor()', () => {
        test('should return true for valid 6-digit hex color', () => {
            assert.strictEqual(isValidHexColor('#a537fd'), true);
            assert.strictEqual(isValidHexColor('#000000'), true);
            assert.strictEqual(isValidHexColor('#ffffff'), true);
            assert.strictEqual(isValidHexColor('#AABBCC'), true);
        });

        test('should return false for 3-digit hex color', () => {
            assert.strictEqual(isValidHexColor('#fff'), false);
            assert.strictEqual(isValidHexColor('#abc'), false);
        });

        test('should return false for missing hash', () => {
            assert.strictEqual(isValidHexColor('ff0000'), false);
        });

        test('should return false for invalid characters', () => {
            assert.strictEqual(isValidHexColor('#gggggg'), false);
            assert.strictEqual(isValidHexColor('#12345g'), false);
        });

        test('should return false for RGB format', () => {
            assert.strictEqual(isValidHexColor('rgb(255,0,0)'), false);
        });

        test('should return false for empty string', () => {
            assert.strictEqual(isValidHexColor(''), false);
        });

        test('should return false for too long hex', () => {
            assert.strictEqual(isValidHexColor('#1234567'), false);
        });
    });

    suite('isValidAngle()', () => {
        test('should return true for valid angles', () => {
            assert.strictEqual(isValidAngle(0), true);
            assert.strictEqual(isValidAngle(90), true);
            assert.strictEqual(isValidAngle(180), true);
            assert.strictEqual(isValidAngle(270), true);
            assert.strictEqual(isValidAngle(360), true);
            assert.strictEqual(isValidAngle(140), true);
        });

        test('should return false for negative angles', () => {
            assert.strictEqual(isValidAngle(-1), false);
            assert.strictEqual(isValidAngle(-90), false);
        });

        test('should return false for angles greater than 360', () => {
            assert.strictEqual(isValidAngle(361), false);
            assert.strictEqual(isValidAngle(720), false);
        });

        test('should handle decimal angles', () => {
            assert.strictEqual(isValidAngle(45.5), true);
            assert.strictEqual(isValidAngle(0.1), true);
        });

        test('should return false for NaN', () => {
            assert.strictEqual(isValidAngle(NaN), false);
        });
    });

    suite('cleanBase64Prefix()', () => {
        test('should remove PNG data URI prefix', () => {
            const input = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==';
            const result = cleanBase64Prefix(input);
            assert.strictEqual(result, 'iVBORw0KGgoAAAANSUhEUg==');
        });

        test('should remove JPEG data URI prefix', () => {
            const input = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
            const result = cleanBase64Prefix(input);
            assert.strictEqual(result, '/9j/4AAQSkZJRg==');
        });

        test('should remove WebP data URI prefix', () => {
            const input = 'data:image/webp;base64,UklGRh4=';
            const result = cleanBase64Prefix(input);
            assert.strictEqual(result, 'UklGRh4=');
        });

        test('should return same string if no prefix', () => {
            const input = 'iVBORw0KGgoAAAANSUhEUg==';
            const result = cleanBase64Prefix(input);
            assert.strictEqual(result, input);
        });

        test('should handle empty string', () => {
            const result = cleanBase64Prefix('');
            assert.strictEqual(result, '');
        });

        test('should only remove first occurrence of prefix', () => {
            const input = 'data:image/png;base64,data:image/png;base64,test';
            const result = cleanBase64Prefix(input);
            assert.strictEqual(result, 'data:image/png;base64,test');
        });
    });

    suite('Array Operations for Presets', () => {
        test('should find duplicate in array', () => {
            const savedPresets: GradientPreset[] = [
                { color1: '#ff0000', color2: '#00ff00', angle: 90, showMacHeader: true }
            ];
            const newPreset: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            
            const isDuplicate = savedPresets.some(p => presetsEqual(p, newPreset));
            assert.strictEqual(isDuplicate, true);
        });

        test('should not find duplicate when none exists', () => {
            const savedPresets: GradientPreset[] = [
                { color1: '#ff0000', color2: '#00ff00', angle: 90, showMacHeader: true }
            ];
            const newPreset: GradientPreset = {
                color1: '#0000ff',
                color2: '#ffff00',
                angle: 45,
                showMacHeader: false
            };
            
            const isDuplicate = savedPresets.some(p => presetsEqual(p, newPreset));
            assert.strictEqual(isDuplicate, false);
        });

        test('should filter out preset from array', () => {
            const presets: GradientPreset[] = [
                { color1: '#ff0000', color2: '#00ff00', angle: 90, showMacHeader: true },
                { color1: '#0000ff', color2: '#ffff00', angle: 45, showMacHeader: false }
            ];
            const toRemove: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            
            const filtered = presets.filter(p => !presetsEqual(p, toRemove));
            assert.strictEqual(filtered.length, 1);
            assert.strictEqual(filtered[0].color1, '#0000ff');
        });

        test('should handle empty array', () => {
            const savedPresets: GradientPreset[] = [];
            const newPreset: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: true
            };
            
            const isDuplicate = savedPresets.some(p => presetsEqual(p, newPreset));
            assert.strictEqual(isDuplicate, false);
        });

        test('should combine default and saved presets', () => {
            const defaultPresets: GradientPreset[] = [
                { color1: '#a537fd', color2: '#21d1f4', angle: 140, showMacHeader: true, isDefault: true }
            ];
            const savedPresets: GradientPreset[] = [
                { color1: '#ff0000', color2: '#0000ff', angle: 90, showMacHeader: true }
            ];
            
            const allPresets = [...defaultPresets, ...savedPresets];
            assert.strictEqual(allPresets.length, 2);
            assert.strictEqual(allPresets[0].isDefault, true);
            assert.strictEqual(allPresets[1].isDefault, undefined);
        });
    });

    suite('Color Format Handling', () => {
        test('should handle hex colors with uppercase', () => {
            const preset: GradientPreset = {
                color1: '#AABBCC',
                color2: '#DDEEFF',
                angle: 0,
                showMacHeader: true
            };
            
            assert.ok(preset.color1.match(/^#[0-9A-Fa-f]{6}$/));
        });

        test('should handle hex colors with lowercase', () => {
            const preset: GradientPreset = {
                color1: '#aabbcc',
                color2: '#ddeeff',
                angle: 0,
                showMacHeader: true
            };
            
            assert.ok(preset.color1.match(/^#[0-9A-Fa-f]{6}$/));
        });
    });
});
