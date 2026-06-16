import eslintReact from '@eslint-react/eslint-plugin'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default [
	eslintReact.configs?.recommended ?? {},
	eslintReact.configs?.['jsx-runtime'] ?? {},

	...compat.extends(
		'eslint:recommended',
		'plugin:prettier/recommended',
	),

	{
		plugins: {
			react: eslintReact,
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
				ecmaFeatures: { jsx: true },
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
			'no-undef': 'off',
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
