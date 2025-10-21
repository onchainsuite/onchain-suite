import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  // Base recommended configs
  js.configs.recommended,

  // Next.js configs - THIS IS THE KEY FIX
  ...compat.config({
  extends: ["next/core-web-vitals", "next/typescript", "next"],
}),

  // Global ignores
  {
    ignores: [
      "node_modules/**",
      "prisma/generated/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "*.min.js",
      "next-env.d.ts",
      "**/*.d.ts",
      "public/**",
      ".env*",
      "*.config.js",
      "*.config.mjs",
    ],
  },

  // Main configuration for TypeScript/JavaScript files
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      globals: {
        React: "readonly",
        NodeJS: "readonly",
        JSX: "readonly",
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        global: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
      "unused-imports": unusedImportsPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      // Add Next.js settings if needed
      next: {
        rootDir: ".", // Adjust if your Next.js app is in a subdirectory
      },
      // Configure simple-import-sort
      "simple-import-sort": {
        groups: [
          // React and Next.js imports
          ["^react", "^next", "^@next"],
          // External packages
          ["^[a-zA-Z]"],
          // Internal absolute imports
          ["^@/"],
          // Internal relative imports
          ["^[./]"],
          // Type imports
          ["^.*\\u0000$"],
        ],
      },
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // Import sorting and organization
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // External packages (ascending order) including types - @ packages come first
            ["^@[a-zA-Z]", "^[a-zA-Z]"],
            // Internal (react-components in ascending order)
            ["^@/components"],
            // Internal (config, constants, hooks, lib/, server-actions, utils/, validation)
            ["^@/config", "^@/constants", "^@/hooks", "^@/lib", "^@/server", "^@/utils", "^@/validation"],
            // Internal (types)
            ["^@/types"],
            // Internal relative imports
            ["^[./]"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off", // TypeScript handles this
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      // React specific rules
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // We use TypeScript
      "react/display-name": "warn",
      "react/no-unescaped-entities": "warn",
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-react": "off", // Not needed in React 17+
      "react/jsx-uses-vars": "error",
      "react/no-array-index-key": "warn",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-unsafe": "warn",
      "react/self-closing-comp": "error",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/no-access-key": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",

      // General JavaScript/TypeScript rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "warn",
      "no-duplicate-imports": "off", // Handled by import plugin
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "prefer-destructuring": [
        "error",
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],

      // Code quality rules
      "eqeqeq": "error",
      "curly": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-useless-concat": "error",
      "no-useless-escape": "error",
      "no-void": "error",
      "radix": "error",

      // Performance rules
      "no-inner-declarations": "error",
      "no-loop-func": "error",
    },
  },

  // Prettier config (should be last to override conflicting rules)
  prettierConfig,
];

export default eslintConfig;
