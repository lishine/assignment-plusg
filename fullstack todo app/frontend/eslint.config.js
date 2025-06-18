import { fixupConfigRules } from '@eslint/compat'
import eslint from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactJsx from 'eslint-plugin-react/configs/jsx-runtime.js'
import react from 'eslint-plugin-react/configs/recommended.js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
    { languageOptions: { globals: globals.browser } },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    ...fixupConfigRules([
        {
            ...react,
            settings: {
                react: { version: 'detect' },
            },
        },
        reactJsx,
    ]),
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': 'off',
            'react/prop-types': 'off',
            curly: 'error',
            'react/no-unknown-property': [
                2,
                {
                    ignore: ['jsx', 'global'],
                },
            ],
        },
    },
    { ignores: ['dist/'] }
)
