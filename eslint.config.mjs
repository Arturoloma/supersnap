import typescriptEslint from "typescript-eslint";

export default [
    {
        files: ["**/*.ts"],
    }, 
    {
        ignores: ["src/webview/**", "dist/**", "out/**"],
    },
    {
        plugins: {
            "@typescript-eslint": typescriptEslint.plugin,
        },

        languageOptions: {
            parser: typescriptEslint.parser,
            ecmaVersion: 2022,
            sourceType: "module",
        },

        rules: {
            "@typescript-eslint/naming-convention": ["warn", {
                selector: "import",
                format: ["camelCase", "PascalCase"],
            }],
            "@typescript-eslint/no-unused-vars": ["warn", { 
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_" 
            }],
            "@typescript-eslint/no-explicit-any": "warn",

            curly: "warn",
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            semi: "warn",
            "prefer-arrow-callback": "warn",
            "prefer-const": "warn",
        },
    }
];