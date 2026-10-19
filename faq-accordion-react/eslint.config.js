import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const browserGlobals = {
  document: "readonly",
  window: "readonly",
  navigator: "readonly",
  localStorage: "readonly",
  HTMLElement: "readonly",
  Element: "readonly",
};

export default [
  {
    ignores: ["dist/**", "dist-lib/**", "storybook-static/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.{js,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: browserGlobals,
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "no-debugger": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];
