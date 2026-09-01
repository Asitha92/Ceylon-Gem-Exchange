import { baseConfig } from '@ceylon-gems/config/eslint/base.js'

export default [
  { ignores: ['dist/**'] },
  ...baseConfig,
  {
    rules: {
      // Nest relies on empty constructor bodies for DI via parameter decorators.
      '@typescript-eslint/no-useless-constructor': 'off',
    },
  },
]
