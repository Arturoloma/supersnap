/**
 * Unit tests for webview/webviewContent.ts
 * Tests HTML generation and Content Security Policy
 */

import * as assert from 'assert';
import { getNonce, getWebviewContent } from '../webview/webviewContent';
import type { GradientPreset } from '../types/messages';

// Mock VS Code webview for testing
const createMockWebview = () => ({
    cspSource: 'https://mock-csp-source.vscode-resource.com',
    asWebviewUri: (uri: unknown) => `webview-uri:${String(uri)}`,
    options: {},
    html: '',
    onDidReceiveMessage: () => ({ dispose: () => {} }),
    postMessage: () => Promise.resolve(true)
});

suite('Webview Content Test Suite', () => {

    suite('getNonce()', () => {
        test('should return a 32 character string', () => {
            const nonce = getNonce();
            assert.strictEqual(nonce.length, 32);
        });

        test('should only contain alphanumeric characters', () => {
            const nonce = getNonce();
            const alphanumericRegex = /^[A-Za-z0-9]+$/;
            assert.ok(alphanumericRegex.test(nonce), 'Nonce should be alphanumeric');
        });

        test('should generate unique nonces', () => {
            const nonces = new Set<string>();
            for (let i = 0; i < 100; i++) {
                nonces.add(getNonce());
            }
            // All 100 nonces should be unique
            assert.strictEqual(nonces.size, 100, 'All generated nonces should be unique');
        });

        test('should not contain special characters', () => {
            const nonce = getNonce();
            const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            assert.ok(!specialChars.test(nonce), 'Nonce should not contain special characters');
        });
    });

    suite('getWebviewContent()', () => {
        const mockWebview = createMockWebview();

        test('should return valid HTML document', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('<!DOCTYPE html>'), 'Should have DOCTYPE');
            assert.ok(html.includes('<html lang="en">'), 'Should have html tag with lang');
            assert.ok(html.includes('</html>'), 'Should have closing html tag');
            assert.ok(html.includes('<head>'), 'Should have head tag');
            assert.ok(html.includes('</head>'), 'Should have closing head tag');
            assert.ok(html.includes('<body>'), 'Should have body tag');
            assert.ok(html.includes('</body>'), 'Should have closing body tag');
        });

        test('should include Content Security Policy', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('Content-Security-Policy'), 'Should have CSP meta tag');
            assert.ok(html.includes("default-src 'none'"), 'CSP should block default sources');
            assert.ok(html.includes("style-src 'unsafe-inline'"), 'CSP should allow inline styles');
            assert.ok(html.includes('https://cdnjs.cloudflare.com'), 'CSP should allow CDN scripts');
        });

        test('should include nonce for scripts', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            // Check for nonce attribute in script tags
            const noncePattern = /nonce="[A-Za-z0-9]{32}"/g;
            const matches = html.match(noncePattern);
            assert.ok(matches && matches.length >= 2, 'Should have nonce attributes on scripts');
        });

        test('should include title', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('<title>SuperSnap</title>'), 'Should have SuperSnap title');
        });

        test('should include html-to-image CDN script', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(
                html.includes('https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js'),
                'Should include html-to-image CDN'
            );
        });

        test('should include required UI elements', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('id="controls"'), 'Should have controls container');
            assert.ok(html.includes('id="preview-area"'), 'Should have preview area');
            assert.ok(html.includes('id="snap-container"'), 'Should have snap container');
            assert.ok(html.includes('id="code-content"'), 'Should have code content area');
            assert.ok(html.includes('id="snap-btn"'), 'Should have snap button');
        });

        test('should include color input controls', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('id="color1"'), 'Should have color1 input');
            assert.ok(html.includes('id="color2"'), 'Should have color2 input');
            assert.ok(html.includes('type="color"'), 'Should have color type inputs');
        });

        test('should include angle slider', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('id="angle"'), 'Should have angle input');
            assert.ok(html.includes('type="range"'), 'Should have range type input');
            assert.ok(html.includes('min="0"'), 'Should have min 0');
            assert.ok(html.includes('max="360"'), 'Should have max 360');
        });

        test('should include Mac header toggle', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('id="mac-header-toggle"'), 'Should have mac header toggle');
            assert.ok(html.includes('type="checkbox"'), 'Should be checkbox type');
        });

        test('should include save configuration button', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('id="save-config-btn"'), 'Should have save config button');
            assert.ok(html.includes('Save Configuration'), 'Should have button text');
        });

        test('should include confirmation dialog', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('id="confirm-dialog"'), 'Should have confirm dialog');
            assert.ok(html.includes('id="cancel-remove"'), 'Should have cancel button');
            assert.ok(html.includes('id="confirm-remove"'), 'Should have confirm button');
        });

        test('should include presets container', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('id="saved-presets"'), 'Should have saved presets container');
        });

        test('should include macOS-style window chrome', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('class="title-bar"'), 'Should have title bar');
            assert.ok(html.includes('class="dot red"'), 'Should have red dot');
            assert.ok(html.includes('class="dot yellow"'), 'Should have yellow dot');
            assert.ok(html.includes('class="dot green"'), 'Should have green dot');
        });

        test('should use default preset colors when no lastSelection provided', () => {
            const defaultPresets: GradientPreset[] = [
                { color1: '#a537fd', color2: '#21d1f4', angle: 140, showMacHeader: true, isDefault: true }
            ];
            
            const html = getWebviewContent(mockWebview as never, [], defaultPresets);
            
            assert.ok(html.includes('value="#a537fd"'), 'Should use first preset color1');
            assert.ok(html.includes('value="#21d1f4"'), 'Should use first preset color2');
            assert.ok(html.includes('value="140"'), 'Should use first preset angle');
        });

        test('should use lastSelection when provided', () => {
            const lastSelection: GradientPreset = {
                color1: '#ff0000',
                color2: '#00ff00',
                angle: 90,
                showMacHeader: false
            };
            
            const html = getWebviewContent(mockWebview as never, [], [], lastSelection);
            
            assert.ok(html.includes('value="#ff0000"'), 'Should use lastSelection color1');
            assert.ok(html.includes('value="#00ff00"'), 'Should use lastSelection color2');
            assert.ok(html.includes('value="90"'), 'Should use lastSelection angle');
        });

        test('should set gradient style on snap container', () => {
            const lastSelection: GradientPreset = {
                color1: '#abc123',
                color2: '#def456',
                angle: 45,
                showMacHeader: true
            };
            
            const html = getWebviewContent(mockWebview as never, [], [], lastSelection);
            
            assert.ok(
                html.includes('linear-gradient(45deg, #abc123, #def456)'),
                'Should set gradient style on snap container'
            );
        });

        test('should handle Mac header toggle based on lastSelection', () => {
            const withHeader: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 0,
                showMacHeader: true
            };
            
            const htmlWithHeader = getWebviewContent(mockWebview as never, [], [], withHeader);
            assert.ok(htmlWithHeader.includes('checked'), 'Should have checked checkbox when showMacHeader is true');
            
            const withoutHeader: GradientPreset = {
                color1: '#000000',
                color2: '#ffffff',
                angle: 0,
                showMacHeader: false
            };
            
            const htmlWithoutHeader = getWebviewContent(mockWebview as never, [], [], withoutHeader);
            // Title bar should be hidden when showMacHeader is false
            assert.ok(htmlWithoutHeader.includes('display: none'), 'Title bar should be hidden');
        });

        test('should inject presets into window.initialPresets', () => {
            const savedPresets: GradientPreset[] = [
                { color1: '#111111', color2: '#222222', angle: 10, showMacHeader: true }
            ];
            const defaultPresets: GradientPreset[] = [
                { color1: '#333333', color2: '#444444', angle: 20, showMacHeader: false, isDefault: true }
            ];
            
            const html = getWebviewContent(mockWebview as never, savedPresets, defaultPresets);
            
            assert.ok(html.includes('window.initialPresets'), 'Should set window.initialPresets');
            assert.ok(html.includes('#333333'), 'Should include default preset color');
            assert.ok(html.includes('#111111'), 'Should include saved preset color');
        });

        test('should include accessibility attributes', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('aria-label'), 'Should have aria-label attributes');
            assert.ok(html.includes('Start gradient color'), 'Should have accessible label for start color');
            assert.ok(html.includes('End gradient color'), 'Should have accessible label for end color');
            assert.ok(html.includes('Gradient rotation angle'), 'Should have accessible label for angle');
        });

        test('should include viewport meta tag', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('name="viewport"'), 'Should have viewport meta tag');
            assert.ok(html.includes('width=device-width'), 'Should have device-width setting');
        });

        test('should include charset meta tag', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            assert.ok(html.includes('charset="UTF-8"'), 'Should have UTF-8 charset');
        });

        test('should use fallback config when no presets provided', () => {
            const html = getWebviewContent(mockWebview as never, [], []);
            
            // Should use fallback values
            assert.ok(html.includes('value="#f8ad45"'), 'Should use fallback color1');
            assert.ok(html.includes('value="#ed5f32"'), 'Should use fallback color2');
        });
    });
});
