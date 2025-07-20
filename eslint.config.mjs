import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // JS & TS base setup
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { prettier: prettierPlugin },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },

  // TypeScript recommended rules
  tseslint.configs.recommended,

  // JSON support
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
    extends: ["json/recommended"],
  },

  // Markdown support
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
]);
