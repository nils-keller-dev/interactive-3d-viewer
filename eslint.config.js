import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default defineConfig([
	js.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
			},
		},
		rules: {
			'prefer-const': 'error',
		},
	},
	eslintConfigPrettier,
]);
