import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
{
    ignores: ["**/build/", "**/__lwr_cache__/"],
    plugins: {
        prettier,
        "@typescript-eslint": typescriptEslint,
    },

    files: ["src/modules/**/*.js", "src/modules/**/*.ts"],
    languageOptions: {
        ecmaVersion: 2020,
        globals: {
            ...globals.browser,
        },
        parser: tsParser,
        sourceType: "module",
    },
},
...compat.extends("eslint:recommended").map(config => ({
    ...config,
    files: ["src/modules/**/*.js", "src/modules/**/*.ts"],
})),
...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
).map(config => ({
    ...config,
    files: ["**/*.ts"],
})),
{
    files: ["**/*.ts"],
    rules: {
        "prettier/prettier": 0,
        "@typescript-eslint/explicit-function-return-type": 1,
        "@typescript-eslint/camelcase": 0,
        "@typescript-eslint/class-name-casing": 0,
        "@typescript-eslint/ban-ts-comment": 1,
    },
}];