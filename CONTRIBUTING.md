# Contributing to SuperSnap

Thank you for your interest in contributing to SuperSnap! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/supersnap.git`
3. Install dependencies: `pnpm install`
4. Open the project in VS Code

## Development Workflow

### Building the Extension

```bash
# Compile TypeScript and bundle with esbuild
pnpm run compile

# Watch mode for development
pnpm run watch
```

### Running Tests

```bash
# Run all tests
pnpm run test

# Type checking
pnpm run check-types

# Linting
pnpm run lint
```

### Testing the Extension

1. Press `F5` in VS Code to open a new Extension Development Host window
2. Test your changes in the development window
3. Use the Debug Console to view logs and errors

## Code Style

- Use TypeScript for all source code
- Follow the existing code style (enforced by ESLint)
- Add JSDoc comments for public functions
- Use meaningful variable and function names
- Keep functions small and focused

## Project Structure

```
supersnap/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── constants.ts           # Constants and configuration
│   ├── types/                 # TypeScript type definitions
│   │   └── messages.ts
│   ├── webview/               # Webview assets
│   │   ├── webviewContent.ts  # HTML generation
│   │   ├── styles.css         # Webview styles
│   │   └── script.js          # Webview JavaScript
│   └── test/                  # Test files
│       └── extension.test.ts
├── dist/                      # Compiled output
└── package.json
```

## Submitting Changes

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests and linting: `pnpm run test && pnpm run lint`
4. Commit your changes with a descriptive message
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused on a single feature or fix

## Reporting Issues

When reporting issues, please include:

- VS Code version
- Extension version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

Feature requests are welcome! Please:

- Check if the feature has already been requested
- Provide a clear use case
- Explain how it would benefit users

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## Questions?

Feel free to open an issue for any questions about contributing!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
