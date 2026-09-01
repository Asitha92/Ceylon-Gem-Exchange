import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { baseConfig } from './base.js'

// React/Expo apps (apps/mobile). Layered on top of baseConfig.
/** @type {import('eslint').Linter.Config[]} */
export const reactNativeConfig = [
  ...baseConfig,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Prevents the classic RN crash: {count && <Text>...} renders "0" as a
      // bare string when count is 0. See vercel-react-native-skills rule 1.1.
      'react/jsx-no-leaked-render': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
]
