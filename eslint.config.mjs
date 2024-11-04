import react from 'eslint-plugin-react'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default [
	...compat.extends(
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:prettier/recommended',
	),
	{
		plugins: {
			react,
			'@typescript-eslint': typescriptEslint,
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
				...globals.node,
				JSX: true,
			},

			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		settings: {
			react: {
				version: 'detect',
			},
		},

		files: ['src/**/*.ts', 'src/**/*.tsx'],

		rules: {
			'react/react-in-jsx-scope': 'off',

			'prettier/prettier': [
				'warn',
				{
					singleQuote: true,
					semi: true,
					indentStyle: 'space',
					indentSize: 2,
					trimTrailingWhitespace: true,
					insertFinalNewline: true,
					printWidth: 120,
					trailingComma: 'all',
				},
			],

			'no-unused-vars': 'off',
		},
	},
]
