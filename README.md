# SuperSnap - Beautiful Code Screenshots

Create stunning, customizable screenshots of your code with beautiful gradient backgrounds and macOS-style window chrome.

## Features

- **Beautiful Gradients**: Choose from preset gradients or create your own custom color combinations
- **Customizable**: Adjust gradient angle and colors in real-time
- **macOS-Style Chrome**: Professional-looking window decorations with traffic light buttons
- **Live Preview**: See your changes instantly before exporting
- **Easy Export**: Save your screenshots as high-quality PNG images
- **Syntax Highlighting**: Preserves your VS Code theme's syntax highlighting

## Usage

1. Select the code you want to screenshot in your editor
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Run the command: **SuperSnap: Take Screenshot**
4. Customize the gradient colors and angle in the sidebar
5. Click **📸 Export Snippet** to save your screenshot

## Configuration

SuperSnap contributes the following settings:

- `supersnap.backgroundGradient`: Default CSS linear-gradient string for the snapshot background
- `supersnap.savedPresets`: List of user-saved gradient presets (coming soon)

## Requirements

No additional requirements or dependencies needed!

## Extension Settings

You can customize the default gradient in your VS Code settings:

```json
{
  "supersnap.backgroundGradient": "linear-gradient(140deg, rgb(165, 55, 253), rgb(33, 209, 244))"
}
```

## Known Issues

- Auto-paste functionality may not work in all scenarios
- Some themes may not preserve background colors correctly

## Release Notes

### 0.0.1

Initial release of SuperSnap:
- Basic screenshot functionality
- Gradient customization
- Preset gradients
- PNG export

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

**Enjoy creating beautiful code screenshots!**
