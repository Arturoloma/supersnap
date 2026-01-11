# SuperSnap - AI Assistant Context Guide

> This document provides essential context, coding standards, and best practices for AI assistants working on the SuperSnap VS Code extension.

---

## 📋 Project Overview

**SuperSnap** is a Visual Studio Code extension that creates beautiful, customizable screenshots of code snippets with gradient backgrounds and macOS-style window chrome.

### Key Features

- **Gradient Backgrounds**: Customizable color gradients with angle control
- **macOS-Style Chrome**: Traffic light buttons for a professional look
- **Preset System**: Default and user-saved gradient presets with persistence
- **Live Preview**: Real-time gradient adjustments
- **High-Quality Export**: PNG export via `html-to-image` library

### Tech Stack

| Component        | Technology                     |
| ---------------- | ------------------------------ |
| Language         | TypeScript (strict mode)       |
| Build Tool       | esbuild                        |
| Package Manager  | pnpm                           |
| Linter           | ESLint with typescript-eslint  |
| Test Framework   | VS Code Test CLI + Mocha       |
| Webview Renderer | html-to-image (CDN)            |

---

## 🏗️ Project Architecture

```
supersnap/
├── src/
│   ├── extension.ts           # Main entry point, command registration
│   ├── constants.ts           # Configuration keys, defaults, presets
│   ├── types/
│   │   └── messages.ts        # TypeScript interfaces for webview messaging
│   └── webview/
│       ├── webviewContent.ts  # HTML/CSS generation for webview panel
│       └── webviewScript.ts   # Client-side JavaScript (runs in webview)
├── dist/                      # Compiled output (bundled by esbuild)
├── .vscode/                   # VS Code debug/task configurations
├── esbuild.js                 # Build configuration
├── eslint.config.mjs          # ESLint flat config
├── tsconfig.json              # TypeScript configuration
└── package.json               # Extension manifest and dependencies
```

### Module Responsibilities

| File                    | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `extension.ts`          | Extension lifecycle, command handler, webview messaging    |
| `constants.ts`          | Centralized constants (avoid magic strings)                |
| `types/messages.ts`     | Strong typing for extension ↔ webview communication        |
| `webviewContent.ts`     | Generates HTML with CSP, styles, and injected script       |
| `webviewScript.ts`      | Handles UI interactions, gradient updates, export logic    |

---

## 🔧 Development Commands

```bash
# Install dependencies
pnpm install

# Compile (type-check + lint + bundle)
pnpm run compile

# Watch mode (continuous compilation)
pnpm run watch

# Type checking only
pnpm run check-types

# Linting
pnpm run lint

# Run tests
pnpm run test

# Package for distribution
pnpm run package
```

### Testing the Extension

1. Press `F5` in VS Code to launch Extension Development Host
2. Select code in the test window
3. Run command: `SuperSnap: Take Screenshot` (Ctrl+Shift+P)

---

## 📐 Coding Style Guidelines

### TypeScript Conventions

1. **Strict Mode**: All code must pass `strict: true` TypeScript checks
2. **Explicit Types**: Prefer explicit return types for public functions
3. **`as const`**: Use for constant objects to get literal types
4. **Avoid `any`**: Use proper types; if unavoidable, add explicit `// @ts-nocheck` only in webview scripts

### Naming Conventions

| Element         | Convention      | Example                     |
| --------------- | --------------- | --------------------------- |
| Constants       | UPPER_SNAKE     | `CONFIG_KEYS`, `DEFAULTS`   |
| Functions       | camelCase       | `handleSaveImage()`         |
| Interfaces      | PascalCase      | `GradientPreset`            |
| Files           | camelCase       | `webviewContent.ts`         |
| Commands        | Namespaced      | `supersnap.start`           |

### Function Documentation

Always use JSDoc for exported functions:

```typescript
/**
 * Handles saving the generated image
 * @param base64Data - Base64 encoded image data with data URI prefix
 */
async function handleSaveImage(base64Data: string): Promise<void> {
    // implementation
}
```

### Code Organization

1. **Imports** at the top, grouped by:
   - VS Code API
   - Project modules
   - Third-party libraries
2. **Exports** at the bottom or inline after declaration
3. **Constants** before functions
4. **Helper functions** before main functions

---

## 🔒 Security Best Practices

### Content Security Policy (CSP)

The webview uses a strict CSP defined in `webviewContent.ts`:

```typescript
const csp = [
    `default-src 'none'`,
    `style-src 'unsafe-inline'`,
    `script-src 'nonce-${nonce}' https://cdnjs.cloudflare.com`,
    `img-src ${webview.cspSource} data:`,
    `connect-src https://cdnjs.cloudflare.com`,
].join('; ');
```

**Rules:**
- Always use nonces for inline scripts
- Only allow necessary CDN sources
- Never use `'unsafe-eval'`

### Input Validation

Always validate messages from webview:

```typescript
if (!base64Data || typeof base64Data !== 'string') {
    throw new Error('Invalid image data');
}
```

---

## 📨 Extension ↔ Webview Messaging

### Message Types

All messages are strictly typed via `WebviewMessage` union type:

| Command              | Direction        | Purpose                          |
| -------------------- | ---------------- | -------------------------------- |
| `saveImage`          | Webview → Ext    | Export screenshot as PNG         |
| `saveConfiguration`  | Webview → Ext    | Save current gradient as preset  |
| `removeConfiguration`| Webview → Ext    | Delete a saved preset            |
| `persistState`       | Webview → Ext    | Auto-save current state          |
| `triggerPaste`       | Ext → Webview    | Trigger paste in code area       |
| `updateConfigurations`| Ext → Webview   | Refresh presets list             |

### Adding New Message Types

1. Define interface in `src/types/messages.ts`
2. Add to `WebviewMessage` union type
3. Handle in `handleWebviewMessage()` switch statement
4. Implement handler function with proper typing

---

## 🎨 Webview Development

### Style Guidelines

- Use CSS custom properties for theming:
  ```css
  :root {
      --panel-bg: #252526;
      --text-color: #cccccc;
      --accent: #007acc;
  }
  ```
- Match VS Code's dark theme aesthetics
- Use `var(--accent)` for interactive elements

### Script Organization

The `webviewScript.ts` is transpiled and embedded as an IIFE:

```typescript
const script = `(${webviewScript.toString()})();`;
```

**Important:**
- The file uses `// @ts-nocheck` because it runs in browser context
- Declare global types: `declare const acquireVsCodeApi: any;`
- Use debouncing for frequent state updates (500ms default)

---

## 🧪 Testing Guidelines

### Test Structure

Tests use VS Code Test CLI with Mocha:

```typescript
suite('SuperSnap Extension Test Suite', () => {
    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('your-publisher-name.supersnap'));
    });
});
```

### Test Categories

1. **Extension Activation**: Verify extension loads correctly
2. **Command Registration**: Ensure commands are available
3. **Configuration**: Validate default settings
4. **Edge Cases**: Handle no active editor gracefully

### Running Tests

```bash
pnpm run test
```

Always run the full test suite after making changes to ensure that existing functionality remains intact.

---

## ⚠️ Known Issues & Workarounds

| Issue                          | Status    | Workaround / Notes                     |
| ------------------------------ | --------- | -------------------------------------- |
| Auto-paste in some scenarios   | Known     | Manual paste fallback available        |
| Theme background preservation  | Partial   | Some themes may not preserve correctly |
| `pasteDone` message type       | Fixed     | Added to WebviewMessage union          |

---

## 📦 Adding New Features

### Checklist for New Features

- [ ] Add constants to `constants.ts`
- [ ] Define types in `types/messages.ts`
- [ ] Implement logic in `extension.ts`
- [ ] Update webview UI in `webviewContent.ts`
- [ ] Handle interactions in `webviewScript.ts`
- [ ] Add tests in `src/test/`
- [ ] Update `README.md` if user-facing
- [ ] Update `CHANGELOG.md`

### Feature Branch Workflow

```bash
git checkout -b feature/your-feature-name
# Make changes
pnpm run compile && pnpm run test
git commit -m "feat: descriptive message"
```

---

## 📚 External Dependencies

| Package           | Purpose                          | Location |
| ----------------- | -------------------------------- | -------- |
| `html-to-image`   | Screenshot generation            | CDN      |
| `vscode`          | VS Code Extension API            | External |

**CDN URL:** `https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js`

---

## 🔄 State Management

### Persisted State

Using `ExtensionContext.globalState`:

| Key                         | Type              | Purpose                    |
| --------------------------- | ----------------- | -------------------------- |
| `supersnap.savedPresets`    | `GradientPreset[]`| User-saved gradient presets|
| `supersnap.lastSelection`   | `GradientPreset`  | Last used gradient config  |

### State Flow

```
User adjusts gradient → debounced persistState() → globalState.update()
                                ↓
Extension restart → getWebviewContent(lastSelection) → Restore UI
```

---

## 🛠️ Troubleshooting

### Common Development Issues

| Problem                            | Solution                                  |
| ---------------------------------- | ----------------------------------------- |
| TypeScript errors not clearing     | Run `pnpm run compile` or restart TS server |
| Webview not updating               | Close panel and re-run command            |
| ESLint errors on save              | Check `eslint.config.mjs` rules           |
| Test failures                      | Ensure publisher name matches in tests    |

### Debug Tips

1. Use `console.warn()` in extension code (visible in Debug Console)
2. Use browser dev tools in webview (Help → Toggle Developer Tools in Extension Host)
3. Check Output panel → "Extension Host" for errors

---

## 📝 Configuration Reference

### Available Settings

| Setting                       | Type     | Default                                                         |
| ----------------------------- | -------- | --------------------------------------------------------------- |
| `supersnap.backgroundGradient`| `string` | `linear-gradient(140deg, rgb(165, 55, 253), rgb(33, 209, 244))` |
| `supersnap.savedPresets`      | `array`  | `[]`                                                            |

---

## 💡 AI Assistant Tips

When working on this codebase:

1. **Always check `types/messages.ts`** before adding new message types
2. **Use constants from `constants.ts`** - never hardcode strings
3. **Follow the existing pattern** for webview message handlers
4. **Validate inputs** in all async handlers
5. **Add JSDoc comments** to new public functions
6. **Test with `F5`** before committing changes
7. **Run `pnpm run compile`** to catch all errors before suggesting changes
8. **Maintain CSP compliance** when adding external resources
9. **Always run tests** (`pnpm run test`) after making any changes to ensure no regressions

---

*Last updated: January 2026*
