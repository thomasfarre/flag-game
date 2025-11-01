import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';

const projectParserOptions = {
  project: ['./tsconfig.json'],
  tsconfigRootDir: import.meta.dirname
};

export default [
  {
    ignores: ['.svelte-kit', 'build', 'dist', 'node_modules']
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
    languageOptions: {
      parserOptions: projectParserOptions
    }
  },
  ...sveltePlugin.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        ...projectParserOptions,
        extraFileExtensions: ['.svelte']
      }
    }
  },
  eslintConfigPrettier
];
