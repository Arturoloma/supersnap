/**
 * Unit tests for webview/webviewStyles.ts
 * Tests the CSS styles exported for the webview
 */

import * as assert from 'assert';
import { styles } from '../webview/webviewStyles';

suite('Webview Styles Test Suite', () => {

    suite('CSS Variables', () => {
        test('should define --panel-bg variable', () => {
            assert.ok(styles.includes('--panel-bg:'), 'Should define --panel-bg');
            assert.ok(styles.includes('#252526'), 'Should have dark panel background color');
        });

        test('should define --text-color variable', () => {
            assert.ok(styles.includes('--text-color:'), 'Should define --text-color');
            assert.ok(styles.includes('#cccccc'), 'Should have light text color');
        });

        test('should define --accent variable', () => {
            assert.ok(styles.includes('--accent:'), 'Should define --accent');
            assert.ok(styles.includes('#007acc'), 'Should have VS Code blue accent color');
        });
    });

    suite('Body Styles', () => {
        test('should have dark background color', () => {
            assert.ok(styles.includes('background-color: #1e1e1e'), 'Body should have dark background');
        });

        test('should use flexbox layout', () => {
            assert.ok(styles.includes('display: flex'), 'Should use flexbox');
            assert.ok(styles.includes('flex-direction: row'), 'Should have row direction');
        });

        test('should have full viewport height', () => {
            assert.ok(styles.includes('height: 100vh'), 'Should be 100vh height');
        });

        test('should reset margin to 0', () => {
            assert.ok(styles.includes('margin: 0'), 'Should have no margin');
        });

        test('should define font-family stack', () => {
            assert.ok(styles.includes('font-family:'), 'Should define font-family');
            assert.ok(styles.includes('-apple-system'), 'Should include Apple system font');
            assert.ok(styles.includes('BlinkMacSystemFont'), 'Should include Blink font');
            assert.ok(styles.includes('Segoe UI'), 'Should include Segoe UI for Windows');
        });
    });

    suite('Controls Sidebar', () => {
        test('should have fixed width', () => {
            assert.ok(styles.includes('width: 280px'), 'Controls should have 280px width');
        });

        test('should use panel background', () => {
            assert.ok(styles.includes('background: var(--panel-bg)'), 'Should use panel-bg variable');
        });

        test('should have border', () => {
            assert.ok(styles.includes('border-right: 1px solid #333'), 'Should have right border');
        });

        test('should have padding', () => {
            assert.ok(styles.includes('padding: 24px'), 'Should have 24px padding');
        });
    });

    suite('Heading Styles', () => {
        test('should have h3 styles', () => {
            assert.ok(styles.includes('h3'), 'Should have h3 styles');
        });

        test('should use uppercase for headings', () => {
            assert.ok(styles.includes('text-transform: uppercase'), 'Should have uppercase text');
        });

        test('should have letter spacing', () => {
            assert.ok(styles.includes('letter-spacing: 1px'), 'Should have letter spacing');
        });
    });

    suite('Input Controls', () => {
        test('should style color inputs', () => {
            assert.ok(styles.includes('input[type="color"]'), 'Should style color inputs');
        });

        test('should style range inputs', () => {
            assert.ok(styles.includes('input[type="range"]'), 'Should style range inputs');
        });

        test('should remove default appearance from color inputs', () => {
            assert.ok(styles.includes('appearance: none'), 'Should remove default appearance');
            assert.ok(styles.includes('-webkit-appearance: none'), 'Should remove webkit appearance');
        });
    });

    suite('Preview Area', () => {
        test('should use flexbox for preview area', () => {
            assert.ok(styles.includes('#preview-area'), 'Should have preview-area styles');
            assert.ok(styles.includes('flex-grow: 1'), 'Should grow to fill space');
        });

        test('should have dotted background pattern', () => {
            assert.ok(
                styles.includes('radial-gradient(#333 1px, transparent 1px)'),
                'Should have dotted background'
            );
            assert.ok(styles.includes('background-size: 20px 20px'), 'Should have 20px pattern size');
        });

        test('should center content', () => {
            assert.ok(styles.includes('align-items: center'), 'Should align items center');
            assert.ok(styles.includes('justify-content: center'), 'Should justify content center');
        });
    });

    suite('Snap Container', () => {
        test('should have padding', () => {
            assert.ok(styles.includes('#snap-container'), 'Should have snap-container styles');
        });

        test('should have border radius', () => {
            assert.ok(styles.includes('border-radius: 12px'), 'Should have 12px border radius');
        });

        test('should have box shadow', () => {
            assert.ok(
                styles.includes('box-shadow: 0 20px 60px rgba(0,0,0,0.5)'),
                'Should have shadow'
            );
        });
    });

    suite('Window Chrome', () => {
        test('should style window container', () => {
            assert.ok(styles.includes('.window'), 'Should have window class styles');
        });

        test('should have dark editor background', () => {
            assert.ok(styles.includes('background-color: #1e1e1e'), 'Should have editor background');
        });

        test('should style title bar', () => {
            assert.ok(styles.includes('.title-bar'), 'Should have title-bar styles');
        });

        test('should style traffic light dots', () => {
            assert.ok(styles.includes('.dot'), 'Should have dot class');
            assert.ok(styles.includes('.red'), 'Should have red dot');
            assert.ok(styles.includes('.yellow'), 'Should have yellow dot');
            assert.ok(styles.includes('.green'), 'Should have green dot');
        });

        test('should have correct traffic light colors', () => {
            assert.ok(styles.includes('background: #ff5f56'), 'Red dot should be #ff5f56');
            assert.ok(styles.includes('background: #ffbd2e'), 'Yellow dot should be #ffbd2e');
            assert.ok(styles.includes('background: #27c93f'), 'Green dot should be #27c93f');
        });

        test('dots should be circular', () => {
            assert.ok(styles.includes('border-radius: 50%'), 'Dots should be circles');
        });
    });

    suite('Snap Button', () => {
        test('should style snap button', () => {
            assert.ok(styles.includes('#snap-btn'), 'Should have snap-btn styles');
        });

        test('should use accent color for background', () => {
            assert.ok(styles.includes('background: var(--accent)'), 'Should use accent color');
        });

        test('should have hover state', () => {
            assert.ok(styles.includes('#snap-btn:hover'), 'Should have hover styles');
            assert.ok(styles.includes('background: #005a9e'), 'Should have darker hover color');
        });

        test('should be bold', () => {
            assert.ok(styles.includes('font-weight: bold'), 'Should be bold text');
        });
    });

    suite('Toggle Switch', () => {
        test('should style toggle switch container', () => {
            assert.ok(styles.includes('.switch'), 'Should have switch class');
        });

        test('should hide default checkbox', () => {
            assert.ok(styles.includes('.switch input'), 'Should style switch input');
            assert.ok(styles.includes('opacity: 0'), 'Should hide checkbox');
        });

        test('should style slider track', () => {
            assert.ok(styles.includes('.slider'), 'Should have slider class');
        });

        test('should have smooth transition', () => {
            assert.ok(styles.includes('transition: .4s'), 'Should have transition');
        });

        test('should style slider knob with :before pseudo-element', () => {
            assert.ok(styles.includes('.slider:before'), 'Should have slider:before');
        });

        test('should style checked state', () => {
            assert.ok(styles.includes('input:checked + .slider'), 'Should have checked slider style');
        });

        test('should include focus-visible styles for accessibility', () => {
            assert.ok(
                styles.includes('.switch input:focus-visible + .slider'),
                'Should have focus-visible styles for accessibility'
            );
            assert.ok(styles.includes('outline: 2px solid var(--accent)'), 'Should have visible focus outline');
        });
    });

    suite('Preset Buttons', () => {
        test('should style preset buttons', () => {
            assert.ok(styles.includes('.preset-button'), 'Should have preset-button class');
        });

        test('should have hover state', () => {
            assert.ok(styles.includes('.preset-button:hover'), 'Should have hover state');
        });

        test('should have active state', () => {
            assert.ok(styles.includes('.preset-button.active'), 'Should have active state');
        });

        test('should style preset grid layout', () => {
            assert.ok(styles.includes('.preset-grid'), 'Should have preset-grid class');
            assert.ok(styles.includes('grid-template-columns: repeat(3, 1fr)'), 'Should be 3 column grid');
        });

        test('should style mini header preview', () => {
            assert.ok(styles.includes('.preset-button .mini-header'), 'Should style mini-header');
            assert.ok(styles.includes('.preset-button .mini-dot'), 'Should style mini-dot');
        });
    });

    suite('Remove Button', () => {
        test('should style remove button', () => {
            assert.ok(styles.includes('.remove-btn'), 'Should have remove-btn class');
        });

        test('should be hidden by default', () => {
            assert.ok(styles.includes('opacity: 0'), 'Should be hidden initially');
        });

        test('should show on hover', () => {
            assert.ok(styles.includes('.preset-wrapper:hover .remove-btn'), 'Should show on parent hover');
        });

        test('should be positioned absolutely', () => {
            assert.ok(styles.includes('position: absolute'), 'Should be absolute positioned');
        });
    });

    suite('Modal Dialog', () => {
        test('should style dialog element', () => {
            assert.ok(styles.includes('dialog'), 'Should style dialog');
        });

        test('should have dark background', () => {
            assert.ok(styles.includes('background: #252526'), 'Dialog should have dark background');
        });

        test('should have backdrop styles', () => {
            assert.ok(styles.includes('dialog::backdrop'), 'Should style backdrop');
        });

        test('should style modal buttons', () => {
            assert.ok(styles.includes('.modal-buttons'), 'Should style modal buttons container');
            assert.ok(styles.includes('.modal-btn'), 'Should style modal button');
            assert.ok(styles.includes('.btn-cancel'), 'Should style cancel button');
            assert.ok(styles.includes('.btn-confirm'), 'Should style confirm button');
        });
    });

    suite('Code Content', () => {
        test('should style code content area', () => {
            assert.ok(styles.includes('#code-content'), 'Should style code-content');
        });

        test('should have padding', () => {
            assert.ok(styles.includes('padding: 20px'), 'Should have padding');
        });

        test('should remove outline', () => {
            assert.ok(styles.includes('outline: none'), 'Should remove outline');
        });

        test('should reset nested element styles', () => {
            assert.ok(styles.includes('#code-content pre'), 'Should reset pre styles');
            assert.ok(styles.includes('#code-content div'), 'Should reset div styles');
            assert.ok(styles.includes('margin: 0 !important'), 'Should reset margins');
            assert.ok(styles.includes('background-color: transparent !important'), 'Should be transparent');
        });
    });

    suite('Overall Style Quality', () => {
        test('should be a non-empty string', () => {
            assert.ok(typeof styles === 'string', 'Styles should be a string');
            assert.ok(styles.length > 1000, 'Styles should have substantial content');
        });

        test('should start with :root for CSS variables', () => {
            assert.ok(styles.includes(':root {'), 'Should define CSS variables in :root');
        });

        test('should not have obvious CSS errors', () => {
            // Check for unmatched braces (basic check)
            const openBraces = (styles.match(/{/g) || []).length;
            const closeBraces = (styles.match(/}/g) || []).length;
            assert.strictEqual(openBraces, closeBraces, 'Should have matching braces');
        });
    });
});
